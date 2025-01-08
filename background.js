const browser = chrome;

// Log installation
browser.runtime.onInstalled.addListener(() => {
    console.log("OPU NSKAL Extension Installed.");
});

// Handle toolbar icon click
browser.browserAction.onClicked.addListener(() => {
    browser.windows.create({
        url: 'uploader.html',
        type: 'popup',
        width: 450,
        height: 600
    });
});

// Handle messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'MAINTAIN_FOCUS') {
        // Get the window ID of the popup
        browser.windows.getCurrent().then(window => {
            // Force focus back to the popup window
            browser.windows.update(window.id, { 
                focused: true 
            }).catch(error => {
                console.error('Error maintaining focus:', error);
            });
        });
    }
    else if (message.type === 'SETTINGS_UPDATED') {
        // Relay message to all windows
        browser.runtime.sendMessage(message).catch(() => {
            // Ignore errors from closed windows
        });
    }
    return true; // Keep messaging channel open for async response
});

// Cookie change listener to keep settings in sync
browser.cookies.onChanged.addListener(({cookie, removed, cause}) => {
    if (cookie.domain === 'opu.peklo.biz') {
        if (!removed) {
            // Check if this is an OPU authentication cookie
            if (cookie.name === 'opu_permanent' || /^opu\d+$/.test(cookie.name)) {
                // Update stored cookie information
                browser.storage.sync.set({
                    cookieName: cookie.name,
                    cookieValue: cookie.value
                }).catch(error => {
                    console.error('Error saving cookie to storage:', error);
                });
            }
        }
    }
});

// Handle any error with cookie permissions
browser.cookies.getAll({ domain: 'opu.peklo.biz' }).catch(error => {
    console.error('Cookie permission error:', error);
});