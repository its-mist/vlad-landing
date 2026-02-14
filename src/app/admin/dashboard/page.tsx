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

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-wide mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link
          href="/admin/dashboard/projects"
          className="bg-gray-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider">Projects</p>
          <p className="text-3xl font-light mt-2">{projectsCount}</p>
        </Link>
        <Link
          href="/admin/dashboard/contacts"
          className="bg-gray-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider">Contacts</p>
          <p className="text-3xl font-light mt-2">{contactsCount}</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/dashboard/projects"
              className="flex items-center gap-3 px-4 py-3 bg-gray-950 border border-white/5 rounded-lg hover:border-white/10 transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add new project
            </Link>
            <Link
              href="/admin/dashboard/about"
              className="flex items-center gap-3 px-4 py-3 bg-gray-950 border border-white/5 rounded-lg hover:border-white/10 transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit about section
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 bg-gray-950 border border-white/5 rounded-lg hover:border-white/10 transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Change settings
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Status</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">About Section</span>
              <span className={`px-2 py-0.5 rounded text-xs ${about ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {about ? 'Configured' : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Background Video</span>
              <span className={`px-2 py-0.5 rounded text-xs ${settings?.backgroundVideo ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {settings?.backgroundVideo ? 'Uploaded' : 'Gradient'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Projects</span>
              <span className={`px-2 py-0.5 rounded text-xs ${projectsCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {projectsCount} items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View site
        </a>
      </div>
    </div>
  )
}
