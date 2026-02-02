#!/bin/bash

# Создаём директории
mkdir -p certbot/conf certbot/www data public/videos

# Временный nginx конфиг для получения сертификата
cat > nginx-init.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name vldmaksimov.pro www.vldmaksimov.pro;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
}
EOF

echo "==> Запускаем временный nginx..."
docker run -d --name nginx-init \
    -p 80:80 \
    -v $(pwd)/nginx-init.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot/www:/var/www/certbot \
    nginx:alpine

echo "==> Получаем SSL сертификат..."
docker run --rm \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    -v $(pwd)/certbot/www:/var/www/certbot \
    certbot/certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@vldmaksimov.pro \
    --agree-tos \
    --no-eff-email \
    -d vldmaksimov.pro \
    -d www.vldmaksimov.pro

echo "==> Останавливаем временный nginx..."
docker stop nginx-init
docker rm nginx-init
rm nginx-init.conf

echo "==> Готово! Теперь запусти: docker compose up -d --build"
