'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const t = useTranslations('nav')

  const scrollTo = (id: string) => {
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

        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo('about')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light"
          >
            {t('about')}
          </button>
          <button
            onClick={() => scrollTo('projects')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light"
          >
            {t('projects')}
          </button>
          <button
            onClick={() => scrollTo('contacts')}
            className="text-white/80 hover:text-white text-base tracking-wider transition-colors font-light"
          >
            {t('contacts')}
          </button>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  )
}
