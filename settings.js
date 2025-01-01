document.addEventListener('DOMContentLoaded', () => {
    const cookieNameInput = document.getElementById('cookieName');
    const cookieValueInput = document.getElementById('cookieValue');
    const fetchCookieButton = document.getElementById('fetchCookieButton');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load existing settings
    chrome.storage.sync.get(['cookieName', 'cookieValue'], (data) => {
        cookieNameInput.value = data.cookieName || '';
        cookieValueInput.value = data.cookieValue || '';
    });

    // Save button click event
    saveButton.addEventListener('click', () => {
        const name = cookieNameInput.value.trim();
        const value = cookieValueInput.value.trim();

        if (!name || !value) {
            alert('Both fields are required.');
            return;
        }

        chrome.storage.sync.set({ cookieName: name, cookieValue: value }, () => {
            statusDiv.textContent = 'Settings saved successfully!';
            setTimeout(() => statusDiv.textContent = '', 2000);
        });
    });

    // Fetch Cookie button click event
    fetchCookieButton.addEventListener('click', () => {
        chrome.cookies.getAll({ domain: 'opu.peklo.biz' }, (cookies) => {
            if (chrome.runtime.lastError) {
                console.error('Error fetching cookies:', chrome.runtime.lastError);
                alert('Failed to fetch cookies. Make sure you are logged in.');
                return;
            }

            let targetCookie = null;

            // First, try to find the 'opu_permanent' cookie
            targetCookie = cookies.find(cookie => cookie.name === 'opu_permanent');

            // If no 'opu_permanent' cookie is found, try to find an 'opu***' cookie
            if (!targetCookie) {
                targetCookie = cookies.find(cookie => /^opu\d+$/.test(cookie.name));
            }

            // If no 'opu***' cookie is found, fallback to any other cookie
            if (!targetCookie) {
                targetCookie = cookies.find(cookie => cookie.name && cookie.value); // First available cookie
            }

            if (targetCookie) {
                cookieNameInput.value = targetCookie.name;
                cookieValueInput.value = targetCookie.value;
                statusDiv.textContent = 'Cookie fetched successfully!';
            } else {
                alert('No matching cookies found. Please make sure you are logged in.');
            }
        });
    });
});
