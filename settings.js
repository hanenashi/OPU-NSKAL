const browser = chrome;

document.addEventListener('DOMContentLoaded', () => {
    const cookieNameInput = document.getElementById('cookieName');
    const cookieValueInput = document.getElementById('cookieValue');
    const fetchCookieButton = document.getElementById('fetchCookieButton');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    console.log('Settings DOM loaded');

    // Load existing settings
    loadSettings();

    function loadSettings() {
        browser.storage.local.get(['cookieName', 'cookieValue'], (data) => {
            console.log('Loaded settings:', data);
            if (data && data.cookieName) {
                cookieNameInput.value = data.cookieName;
                cookieValueInput.value = data.cookieValue;
            }
        });
    }

    // Save button click event
    saveButton.addEventListener('click', () => {
        console.log('Save button clicked');
        const name = cookieNameInput.value.trim();
        const value = cookieValueInput.value.trim();
        
        if (!name || !value) {
            showStatus('Both fields are required.', 'error');
            return;
        }

        // Save to local storage
        const settings = { cookieName: name, cookieValue: value };
        
        browser.storage.local.set(settings, () => {
            if (browser.runtime.lastError) {
                console.error('Storage error:', browser.runtime.lastError);
                showStatus('Failed to save settings.', 'error');
                return;
            }

            showStatus('Settings saved successfully!', 'success');
            // Notify uploader windows
            browser.runtime.sendMessage({ type: 'SETTINGS_UPDATED' });
        });
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.style.color = type === 'success' ? 'green' : 'red';
        setTimeout(() => statusDiv.textContent = '', 3000);
    }

    // Fetch cookie button click event (No changes here)
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
