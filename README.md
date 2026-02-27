# OpenClaw Deployment

This repository contains a deployed version of [OpenClaw](https://github.com/openclaw/openclaw).

## Quick Start

To start the OpenClaw gateway with the saved configuration:

```bash
./start-openclaw.sh
```

## Configuration

The configuration and pairing state are stored in the `openclaw-home` directory. The `start-openclaw.sh` script automatically restores these to `~/.openclaw` before starting.

- **Gateway Token**: `123456`
- **Port**: `3000`

## Accessing the Dashboard

Once the service is running, you can access the Control UI via the Vercel preview URL.
