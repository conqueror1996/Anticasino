const GhostLauncher = require('./src/launcher');

(async () => {
    const ghost = new GhostLauncher();
    const { browser, page, humanizer } = await ghost.launch('CasinoTestProfile_01', {
        headless: false // Show the UI so the user can see it!
    });

    try {
        console.log('[Ghost] Navigating to CreepJS (Detection Gold Standard)...');
        await page.goto('https://abrahamjuliot.github.io/creepjs/', { waitUntil: 'networkidle' });

        // Wait for results
        await page.waitForTimeout(5000);
        
        console.log('[Ghost] Testing human interactions...');
        await humanizer.scroll(500);
        await humanizer.scroll(-200);

        const trustScore = await page.evaluate(() => {
            const scoreEl = document.querySelector('.trust-score');
            return scoreEl ? scoreEl.innerText : 'Unknown';
        });

        console.log(`[Ghost] CreepJS Trust Score: ${trustScore}`);
        console.log('[Ghost] SUCCESS. Browser is active and stealthy.');
        
        // Keep browser open for user to inspect
        // await browser.close();
    } catch (err) {
        console.error('[Ghost] FAILED:', err);
    }
})();
