// popup.js
document.getElementById('collect').addEventListener('click', async () => {
    const urlsText = document.getElementById('urls').value.trim();
    const urls = urlsText.split('\n').map(url => url.trim()).filter(url => url.startsWith('https://www.linkedin.com/in/'));

    if (urls.length < 3) {
        alert('Please enter at least 3 LinkedIn profile URLs.');
        return;
    }

    document.getElementById('status').innerText = 'Starting data collection...';

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            await openAndScrapeProfile(url);
            document.getElementById('status').innerText = `Processed ${i + 1} of ${urls.length}`;
        } catch (error) {
            console.error('Error processing URL:', url, error);
            document.getElementById('status').innerText = `Error processing ${url}`;
        }
    }

    document.getElementById('status').innerText = 'Data collection completed.';
});

// Function to open a new tab, wait for it to load, and inject the content script
async function openAndScrapeProfile(url) {
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url, active: false }, (tab) => {
            // Listen for the tab to finish loading
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    // Inject the content script
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }, () => {
                        // Optionally, close the tab after scraping
                        // chrome.tabs.remove(tab.id);
                        resolve();
                    });
                }
            });
        });
    });
}
