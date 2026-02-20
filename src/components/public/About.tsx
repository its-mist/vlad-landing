'use client'

import { useTranslations } from 'next-intl'
import AnimatedSection from './AnimatedSection'
import PhotoCarousel from './PhotoCarousel'

interface GalleryPhoto {
  id: number
  url: string
  caption?: string | null
}

interface AboutProps {
  title: string
  subtitle?: string
  bio: string
  photoUrl?: string | null
  gallery?: GalleryPhoto[]
}

export default function About({ title, subtitle, bio, photoUrl, gallery = [] }: AboutProps) {
  const t = useTranslations('about')
  const displayTitle = subtitle || title

  return (
    <AnimatedSection
      id="about"
      className="min-h-screen md:h-screen bg-black md:overflow-hidden flex flex-col px-6 pt-20 pb-10 md:pb-5"
    >
      <div className="container mx-auto max-w-5xl flex flex-col gap-4 md:h-full md:min-h-0">

        <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase flex-shrink-0">
          {t('title')}
        </h2>

        {/* Photo + Bio */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-10 md:flex-1 md:min-h-0">
          {photoUrl && (
            <div className="flex-shrink-0 overflow-hidden md:h-full md:aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={displayTitle}
                className="w-full h-auto md:h-full md:object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className={`flex flex-col ${photoUrl ? 'md:flex-1' : 'w-full'} md:justify-center md:min-h-0`}>
            <h3 className="text-white text-2xl md:text-4xl font-light tracking-wider mb-2 md:mb-5 flex-shrink-0">
              {displayTitle}
            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-line md:overflow-hidden">
              {bio}
            </p>
          </div>
        </div>

        {/* Carousel */}
        {gallery.length > 0 && <PhotoCarousel photos={gallery} />}

      </div>
    </AnimatedSection>
  )
}
