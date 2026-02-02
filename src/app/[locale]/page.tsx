import { getLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import Header from '@/components/public/Header'
import Hero from '@/components/public/Hero'
import About from '@/components/public/About'
import Projects from '@/components/public/Projects'
import Contacts from '@/components/public/Contacts'

export const dynamic = 'force-dynamic'

async function getData(locale: string) {
  const [about, projects, contacts, settings] = await Promise.all([
    prisma.about.findFirst(),
    prisma.project.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' }
    }),
    prisma.contact.findMany({
      orderBy: { order: 'asc' }
    }),
    prisma.settings.findFirst()
  ])

  return {
    about: about
      ? {
          title: locale === 'ru' ? about.titleRu : about.titleEn,
          bio: locale === 'ru' ? about.bioRu : about.bioEn,
          photoUrl: about.photoUrl
        }
      : null,
    projects: projects.map((p) => ({
      id: p.id,
      title: locale === 'ru' ? p.titleRu : p.titleEn,
      description: locale === 'ru' ? p.descriptionRu : p.descriptionEn,
      youtubeUrl: p.youtubeUrl
    })),
    contacts,
    settings
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  const { about, projects, contacts, settings } = await getData(locale)

  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero
        title={about?.title || 'PRODUCER'}
        backgroundVideo={settings?.backgroundVideo || undefined}
      />
      {about && (
        <About
          title={about.title}
          bio={about.bio}
          photoUrl={about.photoUrl}
        />
      )}
      <Projects projects={projects} />
      <Contacts contacts={contacts} />
    </main>
  )
}
