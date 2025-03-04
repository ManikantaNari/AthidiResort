(function() {
    // Ensure sequential script loading
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error for ${url}`));
            document.body.appendChild(script);
        });
    }

    // Sequential loading of scripts
    async function initializeScripts() {
        try {
            await loadScript('scripts/navigation.js');
            await loadScript('scripts/tabs.js');
            await loadScript('scripts/form-interactions.js');
            await loadScript('scripts/scroll.js');
            console.log('All scripts loaded successfully');
        } catch (error) {
            console.error('Script loading failed:', error);
        }
    }

    // Run on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScripts);
    } else {
        initializeScripts();
    }
})();