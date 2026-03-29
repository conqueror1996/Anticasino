/**
 * Ghost Browser - Ghost Launcher (Singularity Edition)
 * 
 * Implements Sovereign Script-Shatter (JS Interception), 
 * Singleton-Lock Shredding, JA3 Mimic, and Double-Hop Tunnelling.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const Humanizer = require('./engine/humanizer');
const GhostFarmer = require('./engine/farmer');
const TLSShatterProxy = require('./engine/tls_shatter');
const shred = require('./engine/shredder');

class GhostLauncher {
    constructor() {
        // --- Sovereign Binary Audit ---
        // Automatically shreds cdc_ and webdriver signatures on every cold start.
        try { shred(); } catch(e) { console.error("⚠️ [Shredder] Audit Failed: ", e.message); }
        
        this.stealthScript = fs.readFileSync(path.join(__dirname, 'engine/stealth.js'), 'utf8');
        this.proxies = new Map();
        this.shatteredCount = new Map(); 
    }


    async launch(id, options = {}) {
        const userDataDir = path.resolve(__dirname, `../profiles/${id}`);
        const identityPath = path.resolve(__dirname, `../profiles/${id}.json`);

        // --- Reliability Update: Singleton Lock Shredder ---
        const lockPath = path.join(userDataDir, 'SingletonLock');
        if (fs.existsSync(lockPath)) {
            try { fs.unlinkSync(lockPath); console.log(`🔓 [Reliability] Shredded orphaned SingletonLock for: ${id}`); } catch (e) { }
        }

        const identity = fs.existsSync(identityPath)
            ? JSON.parse(fs.readFileSync(identityPath, 'utf8'))
            : { platform: 'Win32', deviceMemory: 8, hardwareConcurrency: 4 };

        // --- Option D: Sovereign Gateway (TLS-Shatter JA3 Mirroring) ---
        // Robust port allocation loop to prevent EADDRINUSE crashes.
        let ghostPort = 8888 + (this.proxies.size % 1000);
        let portFound = false;
        let shatter = null;
        
        while(!portFound && ghostPort < 10000) {
            try {
                // If a proxy exists for this ID, close it first
                if (this.proxies.has(id)) {
                    const oldShatter = this.proxies.get(id);
                    if (oldShatter && oldShatter.stop) oldShatter.stop();
                }

                shatter = new TLSShatterProxy(ghostPort);
                await new Promise((resolve, reject) => {
                    const server = shatter.start();
                    server.once('listening', () => { portFound = true; resolve(); });
                    server.once('error', (err) => { 
                        if (err.code === 'EADDRINUSE') { ghostPort++; resolve(); }
                        else reject(err);
                    });
                });
                if (portFound) {
                    this.proxies.set(id, shatter);
                }
            } catch (err) { ghostPort++; }
        }

        const proxyConfig = { server: `http://127.0.0.1:${ghostPort}` };

        const args = [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox', '--disable-infobars', '--window-position=0,0',
            '--ignore-certificate-errors', '--disable-web-security', '--disable-field-trial-config',
            '--disable-features=TLSGrease,PostQuantumKyber,IsolateOrigins,site-per-process',
            `--user-agent=${identity.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'}`
        ];
        
        if (options.forceHttp1) {
            args.push('--disable-http2');
        }

        const context = await chromium.launchPersistentContext(userDataDir, {
            headless: options.headless !== undefined ? options.headless : false,
            proxy: proxyConfig, 
            viewport: identity.viewport || { width: 1280, height: 720 },
            locale: identity.locale || 'en-US',
            timezoneId: identity.timezone || 'America/New_York',
            userAgent: identity.userAgent, 
            args: args, 
            ignoreHTTPSErrors: true, 
            colorScheme: 'dark'
        });

        // Auto-cleanup on close
        context.on('close', () => {
            console.log(`🌌 [TLS-SHATTER] Shatter Tunnel Extinguished for: ${id}`);
            if (shatter && shatter.stop) shatter.stop();
            this.proxies.delete(id);
        });


        // --- Option A: Sovereign Script-Shatter (JS Interception) ---
        // Specifically hijacking AWS WAF and Casino-Grade probes.
        await context.route('**/*.js', async (route) => {
            const request = route.request();
            if (request.resourceType() === 'script' && !request.url().includes('chrome-extension')) {
                try {
                    const response = await route.fetch();
                    let body = await response.text();

                    // Detect "Probe Signature" (AWS WAF / Fingerprint.com / Automation Checks)
                    if (body.includes('canvas') || body.includes('audio') || body.includes('awswaf') ||
                        body.includes('cdc_') || body.includes('webdriver')) {

                        console.log(`🎭 [Script-Shatter] Hijacking & Rewriting Probe Script: ${path.basename(request.url())}`);

                        // Inject "Sovereign Jitter Pulse" to performance.now and execution timing
                        const jitterPayload = `
                            (function() {
                                const _origNow = performance.now;
                                performance.now = function() { return _origNow.apply(this, arguments) + (Math.random() * 0.0005); };
                                const _origDateNow = Date.now;
                                Date.now = function() { return _origDateNow.apply(this, arguments) + Math.floor(Math.random() * 2); };
                                // Neutralize manual cdc_ probes
                                window.cdc_adoQtmx08zjnyZ7z000000 = undefined; 
                                console.log("[SHATTER] Execution timing jittered & traces neutralized for this probe.");
                            })();
                        `;
                        body = jitterPayload + body;
                    }
                    await route.fulfill({ response, body });
                } catch (e) { await route.continue(); }
            } else { await route.continue(); }
        });


        const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

        // --- Option B: Sovereign DNA Grafting (Pre-Execution Injection) ---
        if (!options.noStealth) {
            await context.addInitScript(`
                ${this.stealthScript}
                if (window._ghost_applySpecs) {
                    window._ghost_applySpecs(${JSON.stringify(identity)});
                }
            `);
        }

        // --- Option C: Header-Shatter (Network Armor) ---
        // Randomizes header order/casing and Organic Referrer Shattering.
        await context.route('**/*', async (route) => {
            const request = route.request();
            const url = request.url().toLowerCase();
            const method = request.method();
            const body = request.postData() || "";
            const resourceType = request.resourceType();

            // 1. Detection Kill-Switch: Interceding in Reporting & Telemetry
            const abuseKeywords = ['telemetry', 'log_event', 'vitals', 'report', 'analyze', 'probe', 'security', 'fingerprint', 'collect', 'bot_data', 'event_stream'];
            
            if (abuseKeywords.some(k => url.includes(k) || (method === 'POST' && body.includes(k)))) {
                const whitelist = ['google-analytics', 'facebook.com', 'google-tag-manager'];
                if (!whitelist.some(w => url.includes(w))) {
                    console.log(`🛡️ [SOVEREIGN-SHIELD] Deception: Detection Report SPOOFED (200 OK) for: ${path.basename(url)}`);
                    this.shatteredCount.set(id, (this.shatteredCount.get(id) || 0) + 1); 
                    
                    // --- Telemetry Deception (Sovereign V16) ---
                    // Instead of a suspicious 'Abort', we gaslight the casino AI 
                    // by returning a perfect 'Success' response.
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ success: true, status: 'delivered', id: Math.random().toString(36).substring(7) })
                    });
                }
            }

            // 2. Network Header-Shatter
            if (resourceType === 'document' || resourceType === 'xhr' || resourceType === 'fetch') {
                const headers = { ...request.headers() };

                // --- Sovereign V21: .htaccess / IP-Bypass Logic ---
                // If in Hyper-Bypass mode, inject spoofed IP headers to confuse server-side firewalls.
                if (options.hyperBypass) {
                    const fakeIP = `${103 + Math.floor(Math.random()*10)}.${100 + Math.floor(Math.random()*100)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
                    headers['X-Forwarded-For'] = fakeIP;
                    headers['X-Real-IP'] = fakeIP;
                    headers['True-Client-IP'] = fakeIP;
                    headers['Client-IP'] = fakeIP;
                }

                const organicReferrers = [
                    'https://www.google.com/search?q=casino+bonus+codes',
                    'https://twitter.com/search?q=bonus+abuse+guide',
                    'https://www.bing.com/search?q=free+spins+no+deposit',
                    'https://www.reddit.com/r/onlinecasinos/'
                ];

                if (!headers['referer'] || headers['referer'].includes('localhost')) {
                    headers['Referer'] = organicReferrers[Math.floor(Math.random() * organicReferrers.length)];
                }

                const targetHeaders = ['User-Agent', 'Accept-Language', 'Accept', 'Referer', 'Connection'];
                targetHeaders.forEach(h => {
                    if (headers[h.toLowerCase()]) {
                        const val = headers[h.toLowerCase()];
                        delete headers[h.toLowerCase()];
                        const shatteredKey = h.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
                        headers[shatteredKey] = val;
                    }
                });

                await route.continue({ headers });
            } else {
                await route.continue();
            }
        });


        const humanizer = new Humanizer(page);
        const farmer = new GhostFarmer(page);

        return {
            context, page, humanizer, farmer,
            getShatteredCount: () => this.shatteredCount.get(id) || 0,
            navigate: async (url) => {
                // --- Gaussian Timing Armor (Sovereign V9) ---
                // We inject a biological "decision delay" before every navigation.
                const decisionDelay = 500 + Math.floor(this._gaussianRandom() * 1500); 
                await new Promise(r => setTimeout(r, decisionDelay));
                
                // Biological Move to start point
                await humanizer.moveMouse(512 + (Math.random()*10), 384 + (Math.random()*10));
                
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                
                // Post-Navigation Cognitive Stall (Simulating reading)
                const cognitiveStall = 1000 + Math.floor(this._gaussianRandom() * 2000);
                await new Promise(r => setTimeout(r, cognitiveStall));
            }
        };
    }

    // Helper: Standard Gaussian (Central Limit Theorem)
    _gaussianRandom() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); 
        while(v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * 0.5 + 0.5;
    }

    async rotateProxy(id) {
        const ProxyGuard = require('./engine/proxy_guard');
        const identityPath = path.resolve(__dirname, `../profiles/${id}.json`);
        if (!fs.existsSync(identityPath)) throw new Error("Identity not found.");
        
        const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
        console.log(`📡 [SOVEREIGN-FLEET] Initiating Autonomous Failover for: ${id}`);
        
        // 1. Find a fresh audited proxy
        const newProxy = await ProxyGuard.rotate(identity.proxy);
        if (!newProxy) throw new Error("No healthy proxy candidates in pool.");
        
        // 2. Update Identity Vault
        identity.proxy = newProxy;
        fs.writeFileSync(identityPath, JSON.stringify(identity, null, 2));
        
        // 3. Hot-Swap: The next launch will use the new proxy
        console.log(`✅ [SOVEREIGN-FLEET] Proxy Hot-Swapped to: ${newProxy}`);
        return newProxy;
    }
}

module.exports = GhostLauncher;
