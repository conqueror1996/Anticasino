/**
 * Ghost Browser - Humanizer 3.0 (Cognitive Sovereign Edition)
 * 
 * Implements Cognitive State Engine: 
 * - Spatial Memory (Where was the mouse last?)
 * - Scanning Simulation (Eye-tracking focus)
 * - Decision Hesitation (Gaussian load based on target complexity)
 * - Anxiety Jitter (Frustration modeling if actions fail)
 */

class Humanizer {
    constructor(page, logger = (m) => console.log(`[HU] ${m}`)) {
        this.page = page;
        this.logger = logger;
        this.lastX = 100 + Math.random() * 400;
        this.lastY = 100 + Math.random() * 400;
        this.anxiety = 0; // Increases on failures, adds micro-jitter
    }

    async moveMouse(targetX, targetY, options = {}) {
        const startX = this.lastX;
        const startY = this.lastY;
        
        // --- Cognitive Scanning Simulation ---
        // 15% chance to perform a "Saccade" (Eye scanning the page)
        if (Math.random() > 0.85) {
            this.logger(`[COGNITIVE] Scanning Area... (Eye Saccade)`);
            const scanX = targetX + (Math.random() - 0.5) * 300;
            const scanY = targetY + (Math.random() - 0.5) * 300;
            await this._performMove(startX, startY, scanX, scanY, 15);
            await new Promise(r => setTimeout(r, 100 + Math.random() * 300));
        }

        // --- Decision Hesitation ---
        // Gaussian load: Longer pause for "Complex" targets (Buttons vs White Space)
        this.logger(`[COGNITIVE] Decision Delay (Gaussian Load: ${options.complex ? 'HIGH' : 'LOW'})`);
        const delay = (options.complex ? 400 : 100) + Math.random() * 400;
        await new Promise(r => setTimeout(r, delay));

        this.logger(`[ANXIETY] Level: ${this.anxiety.toFixed(2)}`);
        await this._performMove(this.lastX, this.lastY, targetX, targetY, 35 + Math.floor(Math.random() * 20));
        
        this.lastX = targetX;
        this.lastY = targetY;
        
        // Post-movement "Settling" (Organic muscle relaxation)
        if (Math.random() > 0.3) await new Promise(r => setTimeout(r, 100 + Math.random() * 300));
    }

    // Low-level Bezier Move logic with Anxiety Jitter
    async _performMove(startX, startY, endX, endY, steps) {
        const cp1x = startX + (endX - startX) * (0.2 + Math.random() * 0.4);
        const cp1y = startY + (endY - startY) * (0.2 + Math.random() * 0.4);
        const cp2x = startX + (endX - startX) * (0.6 + Math.random() * 0.4);
        const cp2y = startY + (endY - startY) * (0.6 + Math.random() * 0.4);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * endX;
            const y = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * endY;

            // Gaussian Anxiety Jitter (Micro-tremors 0.1px - 0.8px)
            const jitter = (Math.random() - 0.5) * (0.4 + this.anxiety);
            await this.page.mouse.move(x + jitter, y + jitter);
            
            const speed = Math.sin(t * Math.PI);
            await new Promise(r => setTimeout(r, 10 + (30 * (1 - speed)) + (Math.random() * 10)));
        }
    }

    async click(x, y, options = { complex: true }) {
        await this.moveMouse(x, y, options);
        // Biological Decision Delay (Focusing on the target)
        await new Promise(r => setTimeout(r, 50 + Math.random() * 150));
        
        await this.page.mouse.down();
        // Biological Press Duration
        await new Promise(r => setTimeout(r, 60 + Math.random() * 90));
        await this.page.mouse.up();
        
        // Confirmation Pause (Wait for brain to see visual feedback)
        await new Promise(r => setTimeout(r, 200 + Math.random() * 350));
    }

    async hover(x, y) {
        // Cognitive Hover (Human "considering" an item)
        await this.moveMouse(x, y, { complex: true });
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1200));
    }

    async type(text) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // Fat-Finger Correction Engine
            if (Math.random() > 0.98 && i > 0) {
                const nearby = ['q','w','a','s','z']; // Just a cluster for simulation
                await this.page.keyboard.type(nearby[Math.floor(Math.random()*nearby.length)], { delay: 60 });
                await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
                await this.page.keyboard.press('Backspace', { delay: 50 });
                await new Promise(r => setTimeout(r, 150 + Math.random() * 250));
            }

            const pressTime = 40 + Math.floor(Math.random() * 60);
            const pauseTime = 50 + Math.floor(Math.random() * 150);
            
            await this.page.keyboard.down(char);
            await new Promise(r => setTimeout(r, pressTime)); 
            await this.page.keyboard.up(char);
            await new Promise(r => setTimeout(r, pauseTime));
            
            // Typing Brain-Freeze (Thinking about the next word)
            if (char === ' ') await new Promise(r => setTimeout(r, 200 + Math.random() * 500));
            if (Math.random() > 0.96) await new Promise(r => setTimeout(r, 400 + Math.random() * 800));
        }
    }

    fail() { this.anxiety = Math.min(this.anxiety + 0.2, 1.5); }
    success() { this.anxiety = Math.max(0, this.anxiety - 0.1); }
}

module.exports = Humanizer;
