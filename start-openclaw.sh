#!/bin/bash

# Ensure config directory exists
mkdir -p ~/.openclaw

# Copy saved config and state if not present or to restore
echo "Restoring OpenClaw configuration..."
cp -r ./openclaw-home/* ~/.openclaw/

# Navigate to openclaw directory
cd openclaw

# Start openclaw gateway in background
echo "Starting OpenClaw Gateway..."
node openclaw.mjs gateway --allow-unconfigured > ../openclaw.log 2>&1 &

echo "OpenClaw started in background. Logs available in openclaw.log"
echo "Access the dashboard at the preview URL."
