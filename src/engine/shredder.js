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
    const root = path.join(process.env.HOME, 'Library/Caches/ms-playwright');
    if (!fs.existsSync(root)) {
        console.warn("🛑 [SHREDDER] Playwright cache not found in standard location.");
        return;
    }
    
    // Find all 'Chromium' executable binaries.
    let bins;
    try {
        bins = execSync(`find "${root}" -name "Chromium" -type f`).toString().split('\n');
    } catch (e) {
        console.error("🛑 [SHREDDER] Failed to search for binaries:", e.message);
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

