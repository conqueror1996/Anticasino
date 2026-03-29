/**
 * Ghost Browser - Identity DNA Factory (V2 - Sovereign Shuffling)
 * 
 * Generates 100% consistent digital identities matching specific device profiles.
 */

const DNA_VAULT = require('./dna_vault');

class IdentityFactory {
    static CHROME_STABLE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    static MAC_STABLE = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    static SAFARI_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

    // Sovereign Seed Hash: Deterministic DNA Generation per Profile Name
    static _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
        return Math.abs(hash);
    }

    static generate(name, type = 'WIN') {
        const seedValue = this._hash(name);
        // Deterministic PRNG for consistent jitter
        const seededRandom = (noise = 0) => {
            const x = Math.sin(seedValue + noise) * 10000;
            return x - Math.floor(x);
        };

        const typeMap = { 'WIN': 'WIN_GAMING_RTX', 'MAC': 'MAC_M2_PRO', 'IPHONE': 'IPHONE_15_PRO' };
        const finalType = typeMap[type] || type;
        const dna = DNA_VAULT[finalType] || DNA_VAULT['WIN_GAMING_RTX'];
        
        // --- Deterministic DNA Jitter ---
        // Ensuring EVERY "Player ID" has unique but FIXED physical layer fingerprints.
        const widthNoise = Math.floor(seededRandom(1) * 10) - 5;
        const heightNoise = Math.floor(seededRandom(2) * 10) - 5;
        const isMac = finalType.startsWith('MAC');

        return {
            name,
            seed: seedValue,
            ...dna,
            screen: {
                ...dna.screen,
                width: (dna.screen?.width || 1920) + widthNoise,
                height: (dna.screen?.height || 1080) + heightNoise,
                devicePixelRatio: isMac ? 2 : 1
            },
            viewport: {
                width: (isMac ? 1440 : 1280) + widthNoise,
                height: (isMac ? 900 : 720) + heightNoise
            },
            userAgent: isMac ? this.MAC_STABLE : (finalType.startsWith('IPHONE') ? this.SAFARI_MOBILE : this.CHROME_STABLE),
            languages: ['en-US', 'en'],
            locale: 'en-US',
            timezone: 'America/New_York',
            canvasNoise: 0.005 + (seededRandom(3) * 0.015),
            audioNoise: 0.0001 + (seededRandom(4) * 0.0008),
            hasGraft: true,
            debris: true,
            balance: 0.00,
            currency: 'INR'
        };
    }
}

module.exports = IdentityFactory;

