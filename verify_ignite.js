const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log('--- Connecting to http://localhost:3000 ---');
    try {
        await page.goto('http://localhost:3000');
        console.log('✅ Connected to Dashboard.');
        
        const initBtn = await page.$('button:has-text("+ INIT")');
        if (initBtn) {
            console.log('✅ Found + INIT IDENTITY button.');
            await initBtn.click();
            await page.waitForTimeout(1000);
            const modal = await page.$('#createModal');
            const isVisible = await modal.isVisible();
            console.log(isVisible ? '✅ Modal is VISIBLE.' : '❌ Modal is HIDDEN.');
        } else {
            console.log('❌ Could not find + INIT IDENTITY button.');
        }

        const verifyCard = await page.$('.card:has-text("VERIFY_V3")');
        if (verifyCard) {
            console.log('✅ Found VERIFY_V3 card.');
            const igniteBtn = await verifyCard.$('button:has-text("IGNITE")');
            if (igniteBtn) {
                console.log('✅ Found IGNITE button on card.');
                await igniteBtn.click();
                await page.waitForTimeout(2000);
                const btnText = await igniteBtn.textContent();
                console.log(`✅ After click, button text is: ${btnText}`);
            }
        }
    } catch (e) {
        console.error(`❌ Audit Failed: ${e.message}`);
    }
    await browser.close();
})();
