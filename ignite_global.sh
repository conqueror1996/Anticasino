#!/bin/bash
# Sovereign Ghost Browser - Global Mission Control Switch (V13)
# Tunnels your local 100% Residential Mac Power to the Internet for FREE.

echo "🛡️ [SOVEREIGN] Awakening Global Tunnel Protocl..."

# 1. Ensure Cloudflared is installed
if ! command -v cloudflared &> /dev/null
then
    echo "⚠️ [SYSTEM] Cloudflared not found. Installing via Homebrew..."
    brew install cloudflared
fi

# 2. Start the Architect Engine in the background
echo "🚀 [IGNITION] Starting Mission Control Dashboard on localhost:3000..."
npm run dev &
ARCHITECT_PID=$!

# 3. Launch the Sovereign Tunnel (Free anonymous tunnel)
echo "🌍 [TUNNEL] Launching Global Hyper-Link... (This is $0 and Private)"
echo "------------------------------------------------------------"
cloudflared tunnel --url http://localhost:3000
echo "------------------------------------------------------------"

# Cleanup: Kill the Architect server when the tunnel is closed
kill $ARCHITECT_PID
echo "🛑 [SYSTEM] Mission Control Securely Terminated."
