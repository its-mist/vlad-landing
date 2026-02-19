'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const t = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navClass = (id: string) =>
    `text-base tracking-wider font-light transition-colors duration-500 ${
      hoveredItem && hoveredItem !== id ? 'text-white/30' : 'text-white'
    }`

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-light tracking-widest">
          VLADISLAV MAKSIMOV
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('about')}
            onMouseEnter={() => setHoveredItem('about')}
            onMouseLeave={() => setHoveredItem(null)}
            className={navClass('about')}
          >
            {t('about')}
          </button>
          <button
            onClick={() => scrollTo('projects')}
            onMouseEnter={() => setHoveredItem('projects')}
            onMouseLeave={() => setHoveredItem(null)}
            className={navClass('projects')}
          >
            {t('projects')}
          </button>
          <button
            onClick={() => scrollTo('contacts')}
            onMouseEnter={() => setHoveredItem('contacts')}
            onMouseLeave={() => setHoveredItem(null)}
            className={navClass('contacts')}
          >
            {t('contacts')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Burger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-sm px-6 pb-5 flex flex-col gap-4">
          <button
            onClick={() => scrollTo('about')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light text-left"
          >
            {t('about')}
          </button>
          <button
            onClick={() => scrollTo('projects')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light text-left"
          >
            {t('projects')}
          </button>
          <button
            onClick={() => scrollTo('contacts')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light text-left"
          >
            {t('contacts')}
          </button>
          <LanguageSwitcher />
        </div>
      )}
    </header>
  )
}
