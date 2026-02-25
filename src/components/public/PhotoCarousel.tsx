'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface Photo {
  id: number
  url: string
  caption?: string | null
}

export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const n = photos.length

  // Infinite strip: [last, ...photos, first]
  const extended = n > 1 ? [photos[n - 1], ...photos, photos[0]] : photos
  const total = extended.length

  const [vIndex, setVIndex] = useState(n > 1 ? 1 : 0)
  const [realIndex, setRealIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!instant) return
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setInstant(false))
    )
    return () => cancelAnimationFrame(id)
  }, [instant])

  useEffect(() => {
    if (!lightboxPhoto) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxPhoto(null) }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxPhoto])

  // 3 photos per view: track = total/3 * 100%, each photo = 1/3 of container
  const offset = n > 1 ? -((vIndex - 1) / total) * 100 : 0

  const handleTransitionEnd = useCallback(() => {
    if (vIndex >= total - 1) {
      setInstant(true)
      setVIndex(1)
    } else if (vIndex <= 0) {
      setInstant(true)
      setVIndex(n)
    }
  }, [vIndex, total, n])

  const next = useCallback(() => {
    setVIndex((v) => v + 1)
    setRealIndex((r) => (r + 1) % n)
  }, [n])

  const prev = useCallback(() => {
    setVIndex((v) => v - 1)
    setRealIndex((r) => (r - 1 + n) % n)
  }, [n])

  if (n === 0) return null

  return (
    <div className="flex-shrink-0">
      <div className="relative h-[min(14rem,22vh)] overflow-hidden rounded-lg">
        {/* Track: total/3 wide → 3 photos visible at once */}
        <div
          style={{
            display: 'flex',
            width: `${(total / 3) * 100}%`,
            height: '100%',
            transform: `translateX(${offset}%)`,
            transition: instant ? 'none' : 'transform 0.35s ease',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              style={{ width: `${100 / total}%`, padding: '0 3px' }}
              className="flex-shrink-0 h-full"
            >
              <div className="w-full h-full overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || ''}
                  className={`w-full h-full object-contain transition-[filter] duration-300 cursor-pointer ${
                    n >= 3 && i !== vIndex ? 'brightness-50' : ''
                  }`}
                  onClick={() => setLightboxPhoto(photo)}
                />
              </div>
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white z-10 transition-colors"
              aria-label="Предыдущее"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white z-10 transition-colors"
              aria-label="Следующее"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setRealIndex(i)
                setVIndex(i + 1)
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === realIndex ? 'bg-white w-4' : 'bg-white/30 w-1.5'
              }`}
              aria-label={`Фото ${i + 1}`}
            />
          ))}
        </div>
      )}

      {mounted && lightboxPhoto && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxPhoto(null) }}
            aria-label="Закрыть"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxPhoto.url}
            alt={lightboxPhoto.caption || ''}
            className="max-w-full max-h-full object-contain select-none"
            style={{ maxHeight: '100dvh', maxWidth: '100dvw', padding: '3rem 1rem 1rem' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  )
}
