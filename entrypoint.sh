#!/bin/sh
# Fix ownership of mounted volumes so nextjs user can write to SQLite
chown -R nextjs:nodejs /app/data 2>/dev/null || true
chown -R nextjs:nodejs /app/public/videos 2>/dev/null || true

# Drop privileges and run the app as nextjs
exec gosu nextjs node server.js
