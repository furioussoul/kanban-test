#!/bin/bash
set -e

echo "--> Installing dependencies..."
pnpm install

echo "--> Building UI..."
pnpm ui:build

echo "--> Building Core..."
pnpm build

echo "--> Fixing missing templates..."
cd docs/reference/templates
for file in *.dev.md; do
  base="${file%.dev.md}"
  if [ ! -f "$base.md" ]; then
    echo "Copying $file to $base.md"
    cp "$file" "$base.md"
  fi
done
cd ../../..

echo "--> Starting Gateway on port 3000..."
# Using --allow-unconfigured to allow start without full config
exec pnpm openclaw gateway --port 3000 --verbose --allow-unconfigured
