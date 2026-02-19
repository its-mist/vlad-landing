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
      className="h-screen bg-black overflow-hidden flex flex-col px-6 pt-20 pb-5"
    >
      <div className="container mx-auto max-w-5xl flex flex-col h-full gap-4 min-h-0">

        <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase flex-shrink-0">
          {t('title')}
        </h2>

        {/* Photo + Bio */}
        <div className="flex gap-10 flex-1 min-h-0">
          {photoUrl && (
            <div className="h-full aspect-[3/4] flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={displayTitle}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className={`flex flex-col justify-center min-h-0 overflow-hidden ${photoUrl ? 'flex-1' : 'w-full'}`}>
            <h3 className="text-white text-3xl md:text-4xl font-light tracking-wider mb-5 flex-shrink-0">
              {displayTitle}
            </h3>
            <p className="text-white/70 text-base leading-relaxed whitespace-pre-line overflow-hidden">
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
