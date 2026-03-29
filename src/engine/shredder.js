/**
 * Ghost Browser - Binary Shredder (Sovereign V2 - God-Level Pattern Matching)
 * 
 * Patches Chromium binaries to erase hardcoded automation signatures 
 * used by Akamai, Datadome, and Cloudflare.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateRandomPattern(len) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = 'GHOST_';
    for (let i = 0; i < len - 6; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
}

function shred() {
    console.log("🧬 [SHREDDER] Initiating Global Binary Shatter...");
    // Search in standard OS locations for Playwright's browser cache
    const roots = [
        path.join(process.env.HOME || '/root', 'Library/Caches/ms-playwright'), // MacOS
        path.join(process.env.HOME || '/root', '.cache/ms-playwright'),         // Linux
        '/ms-playwright'                                                        // Docker / MS Image
    ];
    
    let bins = [];
    roots.forEach(root => {
        if (!fs.existsSync(root)) return;
        try {
            // Find all 'browser' executables (chrome, Chromium, msedge)
            const found = execSync(`find "${root}" -type f \\( -name "Chromium" -o -name "chrome" -o -name "msedge" \\)`).toString().split('\n');
            bins = bins.concat(found);
        } catch (e) {}
    });
    
    if (bins.length === 0) {
        console.warn("🛑 [SHREDDER] Playwright cache not found. Ensure browsers are installed with 'npx playwright install'.");
        return;
    }

    const targets = [
        { name: 'cdc_', pattern: /cdc_[a-zA-Z0-9]{22}_/g },
        { name: 'eval_script', pattern: /webdriver_evaluate_script/g },
        { name: 'eval_plain', pattern: /__webdriver_evaluate/g },
        { name: 'script_fn', pattern: /__webdriver_script_fn/g },
        { name: 'async_exec', pattern: /__\$webdriverAsyncExecutor/g }
    ];

    bins.forEach(bin => {
        if (!bin.trim()) return;
        try {
            console.log(`🔍 [SHREDDER] Inspecting: ${path.basename(path.dirname(bin))}/${path.basename(bin)}`);
            let data = fs.readFileSync(bin);
            let contentString = data.toString('binary');
            let modified = false;

            targets.forEach(t => {
                if (t.pattern.test(contentString)) {
                    console.log(`🎯 [SHREDDER] Signature CRACKED: [${t.name}] in ${path.basename(bin)}`);
                    contentString = contentString.replace(t.pattern, (match) => {
                        const mask = generateRandomPattern(match.length);
                        console.log(`🎨 [SHREDDER] Masking ${match.substring(0, 10)}... -> ${mask.substring(0, 10)}...`);
                        return mask;
                    });
                    modified = true;
                }
            });

            if (modified) {
                fs.writeFileSync(bin, contentString, 'binary');
                console.log(`✅ [SHREDDER] Relational Integrity Maintained. Binary Vaulted.`);
            } else {
                console.log(`🛡️  [SHREDDER] No known signatures detected in: ${path.basename(bin)}`);
            }
        } catch (e) {
            console.warn(`⚠️ [SHREDDER] Permissions Error or File Busy: ${bin}`);
        }
    });
}

if (require.main === module) {
    shred();
}

module.exports = shred;

