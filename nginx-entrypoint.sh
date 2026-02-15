#!/bin/sh

DOMAIN="vldmaksimov.pro"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"

# If real certs don't exist, create self-signed dummy certs so nginx can start
if [ ! -f "$CERT_PATH/fullchain.pem" ] || [ ! -f "$CERT_PATH/privkey.pem" ]; then
  echo "No SSL certs found — generating self-signed dummy certs..."
  apk add --no-cache openssl > /dev/null 2>&1
  mkdir -p "$CERT_PATH"
  openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$CERT_PATH/privkey.pem" \
    -out "$CERT_PATH/fullchain.pem" \
    -subj "/CN=localhost"
  echo "Dummy certs created. Run init-letsencrypt.sh to get real certs."
fi

exec nginx -g "daemon off;"
