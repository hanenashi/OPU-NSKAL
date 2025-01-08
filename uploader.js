const browser = chrome;

// Listen for settings updates
browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'SETTINGS_UPDATED') {
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const fileInput = document.getElementById('fileInput');
    const selectFilesButton = document.getElementById('selectFilesButton');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const fileListDiv = document.getElementById('fileList');
    const uploadButton = document.getElementById('uploadButton');
    const statusDiv = document.getElementById('status');
    const resizeCheckbox = document.getElementById('resizeCheckbox');
    const resizePercentageInput = document.getElementById('resizePercentage');
    const tagInput = document.getElementById('tagInput');
    const resizePercentageContainer = document.getElementById('resizePercentageContainer');

    console.log('DOM loaded, checking elements...');

    // Show or hide the percentage input based on checkbox state
    resizeCheckbox.addEventListener('change', () => {
        resizePercentageContainer.style.display = resizeCheckbox.checked ? 'block' : 'none';
    });

    // Handle file selection through the button
    selectFilesButton.addEventListener('click', () => {
        console.log('Select files button clicked');
        fileInput.click();
    });

    // File input change handler
    fileInput.addEventListener('change', () => {
        console.log('File input changed');
        const files = fileInput.files;
        if (files.length > 0) {
            selectedFilesDiv.textContent = `Selected ${files.length} file(s):`;
            fileListDiv.innerHTML = Array.from(files)
                .map(file => `${file.name} (${formatFileSize(file.size)})`)
                .join('<br>');
        } else {
            selectedFilesDiv.textContent = 'No files selected';
            fileListDiv.innerHTML = '';
        }
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get cookie data
    console.log('Getting cookie data...');
    const data = await new Promise((resolve) => {
        browser.storage.local.get(['cookieName', 'cookieValue'], (result) => {
            console.log('Storage get result:', result);
            resolve(result || {});
        });
    });

    const cookieName = data.cookieName;
    const cookieValue = data.cookieValue;
    
    console.log('Cookie data loaded:', cookieName ? 'cookieName present' : 'cookieName missing', cookieValue ? 'cookieValue present' : 'cookieValue missing');

    if (!cookieName || !cookieValue) {
        console.log('No cookie data, showing login message');
        uploadButton.classList.add('red');
        uploadButton.textContent = 'Please Log In - Go to Settings';
        uploadButton.addEventListener('click', () => {
            browser.runtime.openOptionsPage();
        });
    } else {
        console.log('Cookie data present, setting up upload handler');
        uploadButton.classList.remove('red');
        uploadButton.textContent = 'Upload Files';
        uploadButton.addEventListener('click', async () => {
            console.log('Upload button clicked');
            const files = fileInput.files;

            if (!files || !files.length) {
                alert('Please select files to upload.');
                return;
            }

            console.log(`Starting upload of ${files.length} files`);
            const uploadedFileCount = files.length;
            statusDiv.innerHTML = 'Uploading files...<br>';
            uploadButton.disabled = true;
            selectFilesButton.disabled = true;

            try {
                for (let i = 0; i < files.length; i++) {
                    console.log(`Processing file ${i + 1}/${files.length}`);
                    let fileToUpload = files[i];

                    if (resizeCheckbox.checked && fileToUpload.type.startsWith('image/')) {
                        const resizePercentage = parseInt(resizePercentageInput.value);
                        if (resizePercentage <= 0 || resizePercentage > 100) {
                            alert('Resize percentage must be between 1 and 100.');
                            return;
                        }
                        fileToUpload = await resizeImage(fileToUpload, resizePercentage);
                    }

                    const formData = new FormData();
                    formData.append('obrazek[0]', fileToUpload);
                    formData.append(cookieName, cookieValue);
                    formData.append('sizep', '0');
                    formData.append('outputf', 'auto');
                    formData.append('tl_odeslat', 'Odeslat');

                    console.log(`Uploading file ${fileToUpload.name}`);
                    const response = await fetch('https://opu.peklo.biz/opupload.php', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                        headers: { 'Accept': 'text/html,application/xhtml+xml' }
                    });

                    if (response.ok) {
                        statusDiv.innerHTML += `Uploaded ${fileToUpload.name} successfully.<br>`;
                    } else {
                        statusDiv.innerHTML += `Failed to upload ${fileToUpload.name}.<br>`;
                        console.error(`Upload failed for ${fileToUpload.name}`, response.status, response.statusText);
                    }
                }

                // Clear the file input and selection display
                fileInput.value = '';
                selectedFilesDiv.textContent = 'No files selected';
                fileListDiv.innerHTML = '';

                const links = await fetchNewlyUploadedFiles(uploadedFileCount);
                const customTag = tagInput.value || '<br>';
                browser.storage.local.set({ customTag: customTag });

                if (links.length > 0) {
                    setTimeout(() => openResultWindow(links, customTag), 100); // Open result window
                } else {
                    alert("No newly uploaded files found.");
                }
            } catch (error) {
                console.error('Error during upload:', error);
                alert('An error occurred during file upload.');
            } finally {
                uploadButton.disabled = false;
                selectFilesButton.disabled = false;
            }
        });
    }
});

async function resizeImage(file, percentage) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const width = Math.floor(img.width * (percentage / 100));
            const height = Math.floor(img.height * (percentage / 100));

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                URL.revokeObjectURL(objectUrl);
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve(resizedFile);
            }, file.type);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
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

// Function to open the result window with uploaded files
function openResultWindow(links, customTag) {
    const resultWindow = window.open('', '_blank', 'width=600,height=700');
    if (resultWindow) {
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
    } else {
        alert('Failed to open results window. Please check your popup blocker settings.');
    }
}
