'use client'

import { useEffect, useRef, useState } from 'react'

export default function SnapScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [passedHero, setPassedHero] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrolling = false

    const handleWheel = (e: WheelEvent) => {
      if (passedHero || scrolling) return

      const scrollTop = container.scrollTop

      // Only intercept when at the top (Hero visible)
      if (scrollTop < window.innerHeight * 0.5 && e.deltaY > 0) {
        e.preventDefault()
        scrolling = true
        container.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })
        setTimeout(() => {
          scrolling = false
          setPassedHero(true)
        }, 800)
      }
    }

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      if (scrollTop < window.innerHeight * 0.3) {
        setPassedHero(false)
      } else {
        setPassedHero(true)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [passedHero])

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto">
      {children}
    </div>
  )
}
