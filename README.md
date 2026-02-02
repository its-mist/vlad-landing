# Producer Landing

Landing page с админ-панелью на Next.js.

## Стек

- Next.js 14
- Prisma + SQLite
- next-intl (ru/en)
- Tailwind CSS
- Docker

## Деплой на сервер

### Требования

- Docker и Docker Compose
- Домен с настроенным DNS (A-запись на IP сервера)
- Открытые порты 80 и 443

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/its-mist/vlad-landing.git
cd vlad-landing

# 2. Создать .env файл
echo "JWT_SECRET=$(openssl rand -base64 32)" > .env

# 3. Получить SSL сертификат
chmod +x init-ssl.sh
./init-ssl.sh

# 4. Запустить контейнеры
docker compose up -d --build

# 5. Инициализировать базу данных
docker compose exec web npx prisma db push
docker compose exec web npx prisma db seed
```

### Готово

- Сайт: https://vldmaksimov.pro
- Админка: https://vldmaksimov.pro/admin

### Загрузка видео

Видео для фона загружать в папку `public/videos/` на сервере.

### Полезные команды

```bash
# Логи
docker compose logs -f

# Перезапуск
docker compose restart

# Обновление
git pull && docker compose up -d --build

# Остановка
docker compose down
```

## Локальная разработка

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Сайт будет на http://localhost:3000
