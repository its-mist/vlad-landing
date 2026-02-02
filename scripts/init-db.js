const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'data')
const dbPath = path.join(dataDir, 'database.sqlite')

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('Created data directory')
}

// Run prisma commands
console.log('Running database migrations...')
execSync('npx prisma db push', { stdio: 'inherit' })

console.log('Seeding database...')
execSync('npx prisma db seed', { stdio: 'inherit' })

console.log('\nDatabase initialized successfully!')
console.log('Default admin credentials: admin / admin123')
