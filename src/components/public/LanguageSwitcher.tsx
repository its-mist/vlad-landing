'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n/config'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    router.push(`/${newLocale}${currentPathWithoutLocale}`)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`uppercase tracking-wider transition-colors ${
            locale === loc
              ? 'text-white'
              : 'text-white/50 hover:text-white/80'
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  )
}
