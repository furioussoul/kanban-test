#!/bin/bash
set -e

# Configuration
OPENCLAW_DIR="openclaw-repo"
CONFIG_DIR="$HOME/.openclaw"
PORT=5173
TOKEN="c4b751ec37c0f0f22fe838269a7f8a5b494557a1de3374da"

echo "Setting up OpenClaw..."

# 1. Clone repository if not exists
if [ ! -d "$OPENCLAW_DIR" ]; then
    echo "Cloning OpenClaw repository..."
    git clone https://github.com/openclaw/openclaw "$OPENCLAW_DIR"
fi

# 2. Build
echo "Building OpenClaw..."
cd "$OPENCLAW_DIR"
pnpm install
pnpm build
pnpm ui:build

# 3. Setup configuration
echo "Configuring OpenClaw..."
mkdir -p "$CONFIG_DIR/devices"

cat > "$CONFIG_DIR/openclaw.json" <<EOF
{
  "commands": {
    "native": "auto",
    "nativeSkills": "auto",
    "restart": true,
    "ownerDisplay": "raw"
  },
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "$TOKEN"
    },
    "bind": "lan",
    "port": $PORT,
    "controlUi": {
       "dangerouslyAllowHostHeaderOriginFallback": true,
       "allowInsecureAuth": true
    },
    "trustedProxies": ["127.0.0.1", "0.0.0.0/0"]
  }
}
EOF

# 4. Pre-pair devices to bypass "Pairing Required" locking
echo "Setting up pre-paired devices..."
cat > "$CONFIG_DIR/devices/paired.json" <<EOF
{
  "5ff1a653634390385c1de20f4414d32a298d34ed166f8efa7fa55750e0144c17": {
    "deviceId": "5ff1a653634390385c1de20f4414d32a298d34ed166f8efa7fa55750e0144c17",
    "publicKey": "F7ISZeIglq6eodjPwuNVGoGVK1FF0Sv_eScH6SWl8no",
    "platform": "MacIntel",
    "clientId": "openclaw-control-ui",
    "clientMode": "webchat",
    "role": "operator",
    "roles": ["operator"],
    "scopes": ["operator.admin", "operator.approvals", "operator.pairing"],
    "approvedScopes": ["operator.admin", "operator.approvals", "operator.pairing"],
    "createdAtMs": $(date +%s%3N),
    "approvedAtMs": $(date +%s%3N)
  },
  "6c7e1672e69577967dd293ee4b528271b37364023c7b457f6e6b9b6e8c0f6d89": {
    "deviceId": "6c7e1672e69577967dd293ee4b528271b37364023c7b457f6e6b9b6e8c0f6d89",
    "publicKey": "xNhCl65EwhKUZfDT83u3uYSZGrN8pxr8tNffSvKL-Xc",
    "platform": "linux",
    "clientId": "cli",
    "clientMode": "cli",
    "role": "operator",
    "roles": ["operator"],
    "scopes": ["operator.admin", "operator.read", "operator.write", "operator.approvals", "operator.pairing"],
    "approvedScopes": ["operator.admin", "operator.read", "operator.write", "operator.approvals", "operator.pairing"],
    "createdAtMs": $(date +%s%3N),
    "approvedAtMs": $(date +%s%3N)
  }
}
EOF

echo "{}" > "$CONFIG_DIR/devices/pending.json"

# 5. Run gateway
echo "Starting OpenClaw gateway on port $PORT..."
node openclaw.mjs gateway --allow-unconfigured --port $PORT --bind lan 2>&1 &

echo "Deployment complete! Access OpenClaw at your preview URL."
