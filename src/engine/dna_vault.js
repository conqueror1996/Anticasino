/**
 * Ghost Browser - DNA Vault (Sovereign Signatures)
 * 
 * Stores validated, real-world hardware profiles to prevent 
 * "Hybrid Identity" flags (e.g., M1 CPU with NVIDIA GPU).
 */

const DNA_PROFILES = {
    "WIN_GAMING_RTX": {
        platform: "Win32",
        deviceMemory: 16,
        hardwareConcurrency: 12,
        vendor: "Google Inc. (NVIDIA)",
        renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)",
        glVersion: "WebGL 2.0 (OpenGL ES 3.0 Chromium)",
        shadingLanguage: "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)",
        uaData: {
            brands: [
                { brand: "Not A(Brand", version: "99" },
                { brand: "Google Chrome", version: "122" },
                { brand: "Chromium", version: "122" }
            ],
            mobile: false,
            platform: "Windows"
        },
        screen: { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24 }
    },
    "MAC_M2_PRO": {
        platform: "MacIntel",
        deviceMemory: 16,
        hardwareConcurrency: 8,
        vendor: "Google Inc. (Apple)",
        renderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)",
        glVersion: "WebGL 2.0 (OpenGL ES 3.0 Chromium)",
        shadingLanguage: "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.0 Chromium)",
        uaData: {
            brands: [
                { brand: "Not A(Brand", version: "99" },
                { brand: "Google Chrome", version: "122" },
                { brand: "Chromium", version: "122" }
            ],
            mobile: false,
            platform: "macOS"
        },
        screen: { width: 1728, height: 1117, colorDepth: 30, pixelDepth: 30 }
    },
    "IPHONE_15_PRO": {
        platform: "iPhone",
        deviceMemory: 8,
        hardwareConcurrency: 6,
        vendor: "Apple Inc.",
        renderer: "Apple GPU",
        glVersion: "WebGL 2.0",
        shadingLanguage: "WebGL GLSL ES 3.00",
        uaData: null,
        screen: { width: 393, height: 852, colorDepth: 32, pixelDepth: 32 }
    },
    "SAMSUNG_S23": {
        platform: "Linux armv8l",
        deviceMemory: 8,
        hardwareConcurrency: 8,
        vendor: "Google Inc. (Samsung)",
        renderer: "Adreno (TM) 740",
        glVersion: "WebGL 2.0 (OpenGL ES 3.0)",
        shadingLanguage: "WebGL GLSL ES 3.00",
        uaData: {
            brands: [
                { brand: "Not A(Brand", version: "99" },
                { brand: "Google Chrome", version: "116" },
                { brand: "Chromium", version: "116" }
            ],
            mobile: true,
            platform: "Android"
        },
        screen: { width: 360, height: 800, colorDepth: 24, pixelDepth: 24 }
    }
};

module.exports = DNA_PROFILES;
