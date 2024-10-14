// content.js
(async () => {
    // Helper function to wait for an element
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 500);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('Element not found: ' + selector));
            }, timeout);
        });
    }

    try {
        // Wait for essential elements to load
        const nameElement = await waitForElement('.text-heading-xlarge');
        const locationElement = await waitForElement('.text-body-small');
        const bioLineElement = await waitForElement('.text-body-medium');

        // Extract data
        const name = nameElement.innerText.trim();
        const url = window.location.href;
        const location = locationElement.innerText.trim();
        const bioLine = bioLineElement.innerText.trim();

        // Scroll to 'About' section and extract
        window.scrollTo(0, document.body.scrollHeight);
        const aboutElement = await waitForElement('.pv-about__summary-text', 15000);
        const about = aboutElement ? aboutElement.innerText.trim() : '';

        // Placeholder selectors for followerCount and connectionCount
        const followerElement = document.querySelector('.follower-count-selector'); // Update selector
        const connectionElement = document.querySelector('.connection-count-selector'); // Update selector

        const followerCount = followerElement ? parseInt(followerElement.innerText.replace(/[^0-9]/g, '')) : 0;
        const connectionCount = connectionElement ? parseInt(connectionElement.innerText.replace(/[^0-9]/g, '')) : 0;

        // Prepare the data object
        const profileData = {
            name,
            url,
            about,
            bio: '', // LinkedIn might not have a separate 'bio' field
            location,
            followerCount,
            connectionCount,
            bioLine
        };

        // Send data to the API
        const response = await fetch('http://localhost:3000/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            console.log('Profile data sent successfully.');
        } else {
            console.error('Failed to send profile data:', await response.text());
        }

    } catch (error) {
        console.error('Error scraping profile:', error);
    }
})();
