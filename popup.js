document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const statusDiv = document.getElementById('status');
    const resizeCheckbox = document.getElementById('resizeCheckbox');
    const resizePercentageInput = document.getElementById('resizePercentage');
    const tagInput = document.getElementById('tagInput');
    const resizePercentageContainer = document.getElementById('resizePercentageContainer');
    
    // Show or hide the percentage input based on checkbox state
    resizeCheckbox.addEventListener('change', () => {
        console.log('Checkbox changed:', resizeCheckbox.checked);  // Debugging log
        if (resizeCheckbox.checked) {
            resizePercentageContainer.style.display = 'block';
        } else {
            resizePercentageContainer.style.display = 'none';
        }
    });

    chrome.storage.sync.get(['cookieName', 'cookieValue'], (data) => {
        const cookieName = data.cookieName;
        const cookieValue = data.cookieValue;

        if (!cookieName || !cookieValue) {
            uploadButton.classList.add('red');
            uploadButton.textContent = 'Please Log In - Go to Settings';
            uploadButton.addEventListener('click', () => {
                chrome.runtime.openOptionsPage();
            });
        } else {
            uploadButton.classList.remove('red');
            uploadButton.textContent = 'Upload Files';
            uploadButton.addEventListener('click', async () => {
                const files = fileInput.files;

                if (!files.length) {
                    alert('Please select files to upload.');
                    return;
                }

                const uploadedFileCount = files.length;
                statusDiv.innerHTML = 'Uploading files...<br>';

                try {
                    for (let i = 0; i < files.length; i++) {
                        let fileToUpload = files[i];

                        // Resize image if checkbox is selected
                        if (resizeCheckbox.checked) {
                            const resizePercentage = parseInt(resizePercentageInput.value);
                            if (resizePercentage <= 0 || resizePercentage > 100) {
                                alert('Resize percentage must be between 1 and 100.');
                                return;
                            }

                            // Resize image using canvas
                            fileToUpload = await resizeImage(fileToUpload, resizePercentage);
                        }

                        const formData = new FormData();
                        formData.append('obrazek[0]', fileToUpload);
                        formData.append(cookieName, cookieValue);
                        formData.append('sizep', '0');
                        formData.append('outputf', 'auto');
                        formData.append('tl_odeslat', 'Odeslat');

                        const response = await fetch('https://opu.peklo.biz/opupload.php', {
                            method: 'POST',
                            body: formData,
                            headers: { 'Accept': 'text/html,application/xhtml+xml' }
                        });

                        if (response.ok) {
                            statusDiv.innerHTML += `Uploaded ${fileToUpload.name} successfully.<br>`;
                        } else {
                            statusDiv.innerHTML += `Failed to upload ${fileToUpload.name}.<br>`;
                        }
                    }

                    const links = await fetchNewlyUploadedFiles(uploadedFileCount);
                    const customTag = tagInput.value || '<br>';
                    chrome.storage.sync.set({ customTag: customTag });

                    if (links.length > 0) {
                        setTimeout(() => openResultWindow(links, customTag), 100);
                    } else {
                        alert("No newly uploaded files found.");
                    }
                } catch (error) {
                    console.error('Error during upload:', error);
                    alert('An error occurred during file upload.');
                }
            });
        }
    });
});

// Function to resize the image based on the specified percentage
async function resizeImage(file, percentage) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const width = img.width * (percentage / 100);
            const height = img.height * (percentage / 100);

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve(resizedFile);
            }, file.type);
        };

        img.onerror = (err) => {
            reject(err);
        };
    });
}

async function fetchNewlyUploadedFiles(count) {
    try {
        const response = await fetch('https://opu.peklo.biz/?page=userpanel', {
            method: 'GET',
            credentials: 'include'
        });

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const galleryItems = doc.querySelectorAll('div.box a.swipebox');
        const links = [];

        for (let i = 0; i < count && i < galleryItems.length; i++) {
            const fullImageLink = galleryItems[i].href;
            const thumbnailImage = galleryItems[i].querySelector('img');
            const thumbnailLink = thumbnailImage ? thumbnailImage.src : '';

            links.push({ full: fullImageLink, thumb: thumbnailLink });
        }

        return links;
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return [];
    }
}

function openResultWindow(links, customTag) {
    const resultWindow = window.open("", "_blank", "width=600,height=700");

    resultWindow.document.write(`
        <html>
            <head>
                <title>Uploaded Files</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    img { max-height: 50px; margin-right: 10px; vertical-align: middle; }
                    .entry { margin-bottom: 15px; }
                    textarea { width: 100%; height: 90%; font-family: monospace; font-size: 12px; margin-top: 10px; }
                    .copy-button { position: absolute; top: 10px; right: 10px; padding: 8px 12px; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-size: 14px; border-radius: 5px; }
                    .copy-button:hover { background-color: #45a049; }
                    .container { position: relative; }
                </style>
            </head>
            <body>
                <div class="container">
                    <button class="copy-button" id="copyButton">Copy</button>
                    <h3>Uploaded Files:</h3>
                    <div>
                        ${links.map(link => `
                            <div class="entry">
                                <img src="${link.thumb}" alt="Thumbnail">
                                <span>&lt;img src="${link.full}"&gt;</span>
                            </div>
                        `).join('')}
                    </div>
                    <h3>Copy-Paste Ready List:</h3>
                    <textarea id="textarea">${links.map(link => `<img src="${link.full}">${customTag}\n\n`).join('')}</textarea>
                </div>
                <script src="copy-handler.js"></script>
            </body>
        </html>
    `);

    resultWindow.document.close();
}
