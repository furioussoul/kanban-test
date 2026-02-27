# Deployment & Troubleshooting Guide

## 1. Prerequisites

- Node.js >= 22
- pnpm

## 2. Installation & Build

```bash
pnpm install
pnpm ui:build
pnpm build
```

## 3. Fix Missing Templates

If you encounter "Missing workspace template" errors, run the following command to copy the development templates:

```bash
cd docs/reference/templates
for file in *.dev.md; do
  base="${file%.dev.md}"
  if [ ! -f "$base.md" ]; then
    echo "Missing $base.md, copying from $file"
    cp "$file" "$base.md"
  fi
done
cd ../../..
```

## 4. Starting the Gateway

To start the gateway on port 3000 (accessible via the Preview URL):

```bash
pnpm openclaw gateway --port 3000 --verbose --allow-unconfigured
```

**Note:** We use `--allow-unconfigured` to bypass initial strict configuration checks.

## 5. Troubleshooting: "Pairing Required" or "Disconnected"

When accessing the web interface via a public URL (like the Vercel Sandbox preview), the Gateway detects it as a remote connection.

### Solution 1: Trusting the Proxy (Recommended for Vercel/Cloud)

You may need to configure `gateway.trustedProxies` in your config if you are behind a proxy (like Vercel). However, for a quick start:

### Solution 2: Pairing

1. When you open the UI and see a pairing code/request.
2. Go to the terminal where the gateway is running.
3. Look for a pairing code or use the CLI to approve.

Example CLI command to approve (if applicable):
```bash
# List pending pairing requests
pnpm openclaw pairing list

# Approve a request
pnpm openclaw pairing approve <request-id>
```

### Solution 3: Auth Token (For Development)

The gateway log often outputs a browser control URL with a token, e.g.:
`Browser control listening on http://127.0.0.1:3002/ (auth=token)`

If you are strictly in a development environment and want to bypass strict auth for the web client, ensure you are running with appropriate flags or use the `openclaw onboard` wizard to set up an admin user which creates a persistent session.

## 6. Common Issues

- **Port in use**: Run `fuser -k 3000/tcp` (Linux) or `lsof -i :3000` to find and kill the process.
- **Missing Templates**: See Section 3.
