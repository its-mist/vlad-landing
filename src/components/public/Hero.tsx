'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  backgroundVideo?: string
}

export default function Hero({ title, backgroundVideo }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — retry on next user interaction
        const resume = () => { video.play().catch(() => {}); document.removeEventListener('click', resume) }
        document.addEventListener('click', resume, { once: true })
      })
    }

    const onEnded = () => {
      video.currentTime = 0
      tryPlay()
    }

    const onPause = () => {
      // Re-play if paused unexpectedly (not by user)
      if (!video.ended) tryPlay()
    }

    video.addEventListener('ended', onEnded)
    video.addEventListener('pause', onPause)
    tryPlay()

    return () => {
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('pause', onPause)
    }
  }, [backgroundVideo])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      {backgroundVideo ? (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-white text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.3em] text-center"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/30">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
