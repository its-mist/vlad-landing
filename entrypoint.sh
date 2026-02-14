#!/bin/sh
set -e

# Ensure data directory exists and is writable by nextjs
mkdir -p /app/data
chown -R nextjs:nodejs /app/data
chown -R nextjs:nodejs /app/public/videos 2>/dev/null || true

# If database doesn't exist, create it
if [ ! -f /app/data/database.sqlite ]; then
  echo "Database not found, initializing..."
  gosu nextjs npx prisma db push --skip-generate
  gosu nextjs npx prisma db seed
  echo "Database initialized."
fi

# Start the app as nextjs user
exec gosu nextjs node server.js
