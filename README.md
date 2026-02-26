# Kanban Test - OpenClaw Deployment

This repository contains the setup for deploying OpenClaw in a sandbox environment.

## Deployment

To deploy and run OpenClaw, use the provided script:

```bash
chmod +x setup-and-run-openclaw.sh
./setup-and-run-openclaw.sh
```

### Key Configuration

- **Port**: 5173
- **Token**: `c4b751ec37c0f0f22fe838269a7f8a5b494557a1de3374da`
- **Gateway Security**: Adjusted for sandbox reverse proxy compatibility (`dangerouslyAllowHostHeaderOriginFallback`, `allowInsecureAuth`, `trustedProxies`).
- **Pre-pairing**: The script automatically pre-approves the Control UI device ID to bypass the "Pairing Required" lockout common in proxied environments.
