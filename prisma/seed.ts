import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  // Create default About section
  const existingAbout = await prisma.about.findFirst()
  if (!existingAbout) {
    await prisma.about.create({
      data: {
        titleRu: 'Продюсер',
        titleEn: 'Producer',
        bioRu: 'Опытный продюсер с многолетним стажем работы в индустрии развлечений. Специализируюсь на создании уникального контента.',
        bioEn: 'Experienced producer with years of work in the entertainment industry. Specializing in creating unique content.',
        photoUrl: null,
      },
    })
  }

  // Create default Settings
  const existingSettings = await prisma.settings.findFirst()
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        backgroundVideo: '',
        siteTitle: 'Producer Portfolio',
      },
    })
  }

  // Create sample contacts
  const existingContacts = await prisma.contact.findMany()
  if (existingContacts.length === 0) {
    await prisma.contact.createMany({
      data: [
        { type: 'email', value: 'contact@example.com', order: 0 },
        { type: 'telegram', value: '@producer', order: 1 },
        { type: 'instagram', value: '@producer_official', order: 2 },
      ],
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
