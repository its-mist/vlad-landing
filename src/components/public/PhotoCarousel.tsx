'use client'

import { useState, useEffect, useCallback } from 'react'

interface Photo {
  id: number
  url: string
  caption?: string | null
}

export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const n = photos.length

  // Infinite strip: [last, ...photos, first]
  // So vIndex=1 → first real photo, vIndex=n → last real photo
  const extended = n > 1 ? [photos[n - 1], ...photos, photos[0]] : photos
  const total = extended.length

  const [vIndex, setVIndex] = useState(n > 1 ? 1 : 0)
  const [realIndex, setRealIndex] = useState(0)
  const [instant, setInstant] = useState(false)

  // After instant jump re-enable transition in next paint
  useEffect(() => {
    if (!instant) return
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setInstant(false))
    )
    return () => cancelAnimationFrame(id)
  }, [instant])

  // translateX(%): each photo = 1/total of track, show photo at (vIndex-1) on left edge
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
        {/* Track */}
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
                  className={`w-full h-full object-cover transition-[filter] duration-300 ${
                    n >= 3 && i !== vIndex ? 'brightness-50' : ''
                  }`}
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
    </div>
  )
}
