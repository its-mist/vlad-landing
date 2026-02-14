'use client'

import { useTranslations } from 'next-intl'
import AnimatedSection from './AnimatedSection'

interface AboutProps {
  title: string
  bio: string
  photoUrl?: string | null
}

export default function About({ title, bio, photoUrl }: AboutProps) {
  const t = useTranslations('about')

  return (
    <AnimatedSection
      id="about"
      className="min-h-screen bg-black py-24 px-6 flex items-center"
    >
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase mb-12">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {photoUrl && (
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className={photoUrl ? '' : 'md:col-span-2'}>
            <h3 className="text-white text-4xl md:text-5xl font-light tracking-wider mb-8">
              {title}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
