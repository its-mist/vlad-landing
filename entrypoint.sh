#!/bin/sh
# Fix ownership of mounted volume so nextjs user can write to SQLite
chown -R nextjs:nodejs /app/data 2>/dev/null || true

# Drop privileges and run the app as nextjs
exec su -s /bin/sh nextjs -c "node server.js"
