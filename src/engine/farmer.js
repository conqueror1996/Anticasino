/**
 * Ghost Browser - Autonomous Farmer (V2 - Life Simulation)
 * 
 * Simulates a high-trust human "Workday" to seed organic 
 * cookies and history before hitting high-stakes targets.
 */

const Humanizer = require('./humanizer');

class GhostFarmer {
    static async session(launcher, name, options) {
        const { context, page, navigate } = await launcher.launch(name, { headless: false, ...options });
        const h = new Humanizer(page, (m) => console.log(`[FARMER:${name}] ${m}`));
        
        try {
            // --- Task 01: The Search Start ---
            const topics = ['Stock Market Today', 'Champions League Scores', 'iPhone 15 Pro Review', 'Best Casino Bonus', 'Local Weather'];
            const topic = topics[Math.floor(Math.random() * topics.length)];
            
            console.log(`🌾 [FARMER:${name}] Task: Searching for "${topic}"`);
            await page.goto('https://www.google.com');
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
            
            const searchBox = await page.$('textarea[name="q"], input[name="q"]');
            if (searchBox) {
                const box = await searchBox.boundingBox();
                await h.click(box.x + box.width / 2, box.y + box.height / 2);
                await h.type(topic);
                await page.keyboard.press('Enter');
                await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
            }

            // --- Task 02: Biological Reading ---
            console.log(`🌾 [FARMER:${name}] Task: Biological Reading (Scrolling)`);
            for (let i = 0; i < 5; i++) {
                const scrollY = 300 + Math.random() * 1000;
                await page.evaluate((y) => window.scrollBy({ top: y, behavior: 'smooth' }), scrollY);
                // Pause to "read" (Gaussian Cognition)
                await new Promise(r => setTimeout(r, 2000 + Math.random() * 4000));
                if (Math.random() > 0.8) await h.moveMouse(500, 500, { complex: true });
            }

            // --- Task 03: Third-Party Cookie Seeding ---
            console.log(`🌾 [FARMER:${name}] Task: Seeding High-Trust Trackers`);
            const highTrustSites = ['https://www.nytimes.com', 'https://www.reddit.com/r/technology', 'https://www.cnn.com'];
            const site = highTrustSites[Math.floor(Math.random() * highTrustSites.length)];
            await navigate(site);
            await new Promise(r => setTimeout(r, 5000 + Math.random() * 10000));

            console.log(`✅ [FARMER:${name}] Session Complete. Profile is now "HEATED".`);
            await context.close();
        } catch (e) {
            console.error(`🛑 [FARMER ERROR:${name}] ${e.message}`);
            await context.close().catch(() => {});
        }
    }
}

module.exports = GhostFarmer;
