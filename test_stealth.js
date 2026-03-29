/**
 * Ghost Browser - Stealth Verification Probe
 * 
 * Launches a Ghost session and validates the Sovereign Anti-Detect layers.
 */

const GhostLauncher = require('./src/launcher');
const fs = require('fs');
const path = require('path');

async function testStealth() {
    const launcher = new GhostLauncher();
    const testId = 'ST_PROBE_' + Date.now();
    
    console.log(`🛡️  Initiating Sovereign Probe: ${testId}`);

    try {
        // 1. Create a dummy identity
        const IdentityFactory = require('./src/engine/identity_factory');
        const dna = IdentityFactory.generate(testId, 'MAC');
        fs.writeFileSync(path.join(__dirname, 'profiles', `${testId}.json`), JSON.stringify(dna, null, 2));

        // 2. Launch
        const { context, page } = await launcher.launch(testId, { headless: true });
        
        console.log(`✅ Matrix Connection Established. Running Fingerprint Probe...`);

        // 3. Verify Canvas & WebGL Stealth
        const results = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            const d = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
            return {
                platform: navigator.platform,
                memory: navigator.deviceMemory,
                cores: navigator.hardwareConcurrency,
                vendor: d ? gl.getParameter(d.UNMASKED_VENDOR_WEBGL) : 'NONE',
                renderer: d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'NONE',
                automation: navigator.webdriver,
                cdc: !!window.cdc_adoQtmx08zjnyZ7z000000
            };
        });

        console.log(`📊 [PROBE DATA] Platform: ${results.platform}`);
        console.log(`📊 [PROBE DATA] Renderer: ${results.renderer}`);
        console.log(`📊 [PROBE DATA] Webdriver: ${results.automation ? '🔴 DETECTED' : '🟢 STEALTH'}`);
        console.log(`📊 [PROBE DATA] CDC Trace: ${results.cdc ? '🔴 DETECTED' : '🟢 STEALTH'}`);

        if (results.automation || results.cdc || !results.renderer.includes('Apple')) {
            console.error('❌ [PROBE FAILED] Sovereign Leak Detected!');
        } else {
            console.log('💎 [PROBE SUCCESS] Stealth is absolute.');
        }

        await context.close();
        // Cleanup
        fs.unlinkSync(path.join(__dirname, 'profiles', `${testId}.json`));
        require('child_process').execSync(`rm -rf ${path.join(__dirname, 'profiles', testId)}`);

    } catch (err) {
        console.error('🛑 Probe Crash:', err.message);
    }
}

testStealth();
