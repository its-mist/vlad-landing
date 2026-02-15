#!/bin/bash
docker run --rm \
  -v "$(pwd)/data:/data" \
  -v "$(pwd)/set-admin.js:/app/set-admin.js:ro" \
  node:20-bookworm-slim bash -c '
    apt-get update -qq && apt-get install -y -qq python3 make g++ > /dev/null 2>&1
    cd /app && npm install --no-save bcryptjs better-sqlite3 > /dev/null 2>&1
    node set-admin.js
  '
