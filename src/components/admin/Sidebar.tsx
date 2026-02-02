'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dashboard/about', label: 'About', icon: '👤' },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: '🎬' },
  { href: '/admin/dashboard/contacts', label: 'Contacts', icon: '📧' },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-xl font-light tracking-widest text-white">
          PRODUCER
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  )
}
