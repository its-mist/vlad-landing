#!/bin/sh
set -e

DB_PATH="/app/data/database.sqlite"

# Ensure data directory exists and is writable by nextjs
mkdir -p /app/data
chown -R nextjs:nodejs /app/data
chown -R nextjs:nodejs /app/public/videos 2>/dev/null || true

# If database doesn't exist or is empty, create tables and seed
if [ ! -s "$DB_PATH" ]; then
  echo "Database not found, initializing..."

  # Create SQLite database with all tables
  gosu nextjs sqlite3 "$DB_PATH" <<'SQL'
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

CREATE TABLE IF NOT EXISTS "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bioRu" TEXT NOT NULL,
    "bioEn" TEXT NOT NULL,
    "photoUrl" TEXT
);

CREATE TABLE IF NOT EXISTS "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionRu" TEXT,
    "descriptionEn" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "backgroundVideo" TEXT NOT NULL DEFAULT '',
    "siteTitle" TEXT NOT NULL DEFAULT 'Producer Portfolio'
);

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Seed: admin user (password: admin123, bcrypt hash)
INSERT OR IGNORE INTO "User" ("username", "password") VALUES ('admin', '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9mu');

-- Seed: default about
INSERT OR IGNORE INTO "About" ("id", "titleRu", "titleEn", "bioRu", "bioEn") VALUES (1, 'Продюсер', 'Producer', 'Опытный продюсер с многолетним стажем работы в индустрии развлечений.', 'Experienced producer with years of work in the entertainment industry.');

-- Seed: default settings
INSERT OR IGNORE INTO "Settings" ("id", "backgroundVideo", "siteTitle") VALUES (1, '', 'Producer Portfolio');

-- Seed: default contacts
INSERT OR IGNORE INTO "Contact" ("id", "type", "value", "order") VALUES (1, 'email', 'contact@example.com', 0);
INSERT OR IGNORE INTO "Contact" ("id", "type", "value", "order") VALUES (2, 'telegram', '@producer', 1);
INSERT OR IGNORE INTO "Contact" ("id", "type", "value", "order") VALUES (3, 'instagram', '@producer_official', 2);
SQL

  echo "Database initialized successfully."
fi

# Start the app as nextjs user
exec gosu nextjs node server.js
