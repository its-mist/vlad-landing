import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [projectsCount, contactsCount, about, settings] = await Promise.all([
    prisma.project.count(),
    prisma.contact.count(),
    prisma.about.findFirst(),
    prisma.settings.findFirst()
  ])

  return { projectsCount, contactsCount, about, settings }
}

export default async function DashboardPage() {
  const { projectsCount, contactsCount, about, settings } = await getStats()

  const stats = [
    { label: 'Projects', value: projectsCount, href: '/admin/dashboard/projects' },
    { label: 'Contacts', value: contactsCount, href: '/admin/dashboard/contacts' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wider mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-4xl font-light mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-light mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/dashboard/projects"
              className="block px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              + Add new project
            </Link>
            <Link
              href="/admin/dashboard/about"
              className="block px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Edit about section
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="block px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              Change settings
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-light mb-4">Site Status</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">About Section</span>
              <span className={about ? 'text-green-400' : 'text-yellow-400'}>
                {about ? 'Configured' : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Background Video</span>
              <span className={settings?.backgroundVideo ? 'text-green-400' : 'text-yellow-400'}>
                {settings?.backgroundVideo ? 'Set' : 'Using gradient'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Projects</span>
              <span className={projectsCount > 0 ? 'text-green-400' : 'text-yellow-400'}>
                {projectsCount} items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <p className="text-gray-400 text-sm">
          Visit your site: <a href="/" target="_blank" className="text-white hover:underline">/</a>
        </p>
      </div>
    </div>
  )
}
