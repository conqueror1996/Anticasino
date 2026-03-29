const { execSync } = require('child_process');

class ProxyGuard {
    static async audit(proxyUrl) {
        if (!proxyUrl) return { success: true, status: 'NO_PROXY_BYPASS' };

        console.log(`🛡️ [PROXY-GUARD] Auditing Relay Integrity: ${proxyUrl}`);
        
        try {
            // Build the curl command string
            const probeUrl = 'http://ip-api.com/json?fields=status,message,country,isp,org,as,mobile,proxy,hosting,query';
            const authStr = this._getAuthString(proxyUrl);
            const address = this._getAddress(proxyUrl);
            
            const cmd = `curl -s --connect-timeout 8 --proxy "http://${authStr ? authStr + '@' : ''}${address}" "${probeUrl}"`;
            
            const raw = execSync(cmd).toString();
            const data = JSON.parse(raw);
            
            if (data.status !== 'success') throw new Error(data.message || 'Probe Failed');

            const isRisky = data.hosting === true || data.proxy === true || data.org?.toLowerCase().includes('hosting');
            
            const results = {
                success: !isRisky,
                ip: data.query,
                isp: data.isp,
                org: data.org,
                country: data.country,
                type: isRisky ? '🔥 DATACENTER / VPN' : '🟢 RESIDENTIAL',
                score: isRisky ? 20 : 95
            };

            if (isRisky) {
                console.warn(`🛑 [PROXY-GUARD] CRITICAL: Proxy [${data.query}] is a known DATACENTER. Ignite at your own risk.`);
            } else {
                console.log(`✅ [PROXY-GUARD] Relay Verified: ${data.isp} (${data.country}) - ${results.type}`);
            }

            return results;
        } catch (e) {
            console.error(`🛑 [PROXY-GUARD] Relay Breach or Timeout: ${e.message}`);
            return { success: false, error: e.message, type: '🔴 OFFLINE / DEAD' };
        }
    }

    static _getAuthString(url) {
        const clean = url.replace('http://', '').replace('https://', '');
        return clean.includes('@') ? clean.split('@')[0] : null;
    }

    static _getAddress(url) {
        const clean = url.replace('http://', '').replace('https://', '');
        return clean.includes('@') ? clean.split('@')[1] : clean;
    }
}

module.exports = ProxyGuard;
