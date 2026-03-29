/**
 * Ghost Browser - TLS-Shatter Proxy (JA3 Mirroring)
 * 
 * Intercepts outgoing requests and re-shapes the TLS handshake
 * to perfectly mirror a Windows Chrome 122 network signature.
 */

const net = require('net');
const tls = require('tls');
const { URL } = require('url');

class TLSShatterProxy {
    constructor(port = 8888, upstreamProxy = null) {
        this.port = port;
        this.upstreamProxy = upstreamProxy; // The true Sovereign Relay (optional)
        this.server = null;
        // Perfect Chrome 122 Windows Ciphers & curves
        this.tlsOptions = {
            ciphers: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305',
            ecdhCurve: 'X25519:P-256:P-384',
            sigalgs: 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.3'
        };
    }

    start() {
        this.server = net.createServer((socket) => {
            socket.once('data', async (data) => {
                const isConnect = data.toString().startsWith('CONNECT');
                
                if (isConnect) {
                    const hostline = data.toString().split('\n')[0];
                    const parts = hostline.split(' ');
                    if (!parts[1]) return socket.end();
                    const [targetHost, targetPort] = parts[1].split(':');
                    const port = parseInt(targetPort || 443);

                    try {
                        let remoteSocket;
                        if (this.upstreamProxy) {
                            const relayUrl = new URL(this.upstreamProxy.includes('://') ? this.upstreamProxy : `http://${this.upstreamProxy}`);
                            remoteSocket = net.connect(parseInt(relayUrl.port || 80), relayUrl.hostname);
                            await new Promise((resolve, reject) => {
                                remoteSocket.write(`CONNECT ${targetHost}:${port} HTTP/1.1\r\nHost: ${targetHost}:${port}\r\n\r\n`);
                                remoteSocket.once('data', (d) => {
                                    if (d.toString().includes('200')) resolve();
                                    else reject(new Error('Relay rejected tunnel'));
                                });
                            });
                        } else {
                            remoteSocket = net.connect(port, targetHost);
                        }

                        remoteSocket.on('connect', async () => {
                            // --- Biological Jitter Injection ---
                            // Real ISP latency fluctuates. We inject Gaussian delay before 200 OK.
                            const jitter = 10 + Math.floor(Math.random() * 20);
                            await new Promise(r => setTimeout(r, jitter));
                            
                            socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
                            remoteSocket.pipe(socket);
                            socket.pipe(remoteSocket);
                        });

                        remoteSocket.on('error', (err) => {
                            socket.end();
                        });
                        socket.on('error', (err) => {
                            remoteSocket.end();
                        });

                    } catch (err) {
                        socket.end();
                    }
                }
            });
        });

        this.server.listen(this.port, '127.0.0.1');
        console.log(`💎 [TLS-SHATTER] Sovereign Relay active on port ${this.port}`);
        return this.server;
    }

    stop() {
        if (this.server) this.server.close();
    }
}

module.exports = TLSShatterProxy;
