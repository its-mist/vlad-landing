'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import AnimatedSection from './AnimatedSection'
import { motion } from 'framer-motion'

interface Project {
  id: number
  title: string
  description?: string | null
  youtubeUrl: string
}

interface ProjectsProps {
  projects: Project[]
}

interface VideoInfo {
  embedUrl: string
  thumbnailUrl: string
}

function getVideoInfo(url: string): VideoInfo {
  // Rutube
  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-f0-9]{32})/)
  if (rutubeMatch && rutubeMatch[1]) {
    return {
      embedUrl: `https://rutube.ru/play/embed/${rutubeMatch[1]}/`,
      thumbnailUrl: `https://pic.rutube.ru/video/${rutubeMatch[1]}/thumbs/0.jpg`,
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`,
      thumbnailUrl: `https://vumbnail.com/${vimeoMatch[1]}.jpg`,
    }
  }

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
    }
  }

  return { embedUrl: url, thumbnailUrl: '' }
}

function ProjectCard({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  const { embedUrl, thumbnailUrl } = getVideoInfo(project.youtubeUrl)
  const collapsedHeight = '4.5rem'

  useEffect(() => {
    if (textRef.current) {
      setOverflows(textRef.current.scrollHeight > textRef.current.clientHeight + 1)
    }
  }, [project.description])

  return (
    <>
      <div className="relative aspect-video overflow-hidden bg-gray-800 rounded-lg">
        {playing ? (
          <iframe
            src={embedUrl}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full relative cursor-pointer group/play"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20 group-hover/play:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover/play:bg-white/30 group-hover/play:scale-110 transition-all">
                <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-white text-xl font-light tracking-wide">
          {project.title}
        </h3>
        {project.description && (
          <button
            onClick={() => overflows && setExpanded((v) => !v)}
            className={`w-full text-left mt-2 ${overflows ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div
              className="overflow-hidden"
              style={{
                maxHeight: expanded && overflows
                  ? `${textRef.current?.scrollHeight ?? 9999}px`
                  : collapsedHeight,
                transition: 'max-height 0.35s ease',
                WebkitMaskImage: overflows && !expanded
                  ? 'linear-gradient(to bottom, black 40%, transparent 100%)'
                  : 'none',
                maskImage: overflows && !expanded
                  ? 'linear-gradient(to bottom, black 40%, transparent 100%)'
                  : 'none',
              }}
            >
              <p ref={textRef} className="text-white/50 text-sm leading-6">
                {project.description}
              </p>
            </div>
          </button>
        )}
      </div>
    </>
  )
}

export default function Projects({ projects }: ProjectsProps) {
  const t = useTranslations('projects')

  if (projects.length === 0) {
    return null
  }

  return (
    <AnimatedSection
      id="projects"
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-24 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-white/40 text-lg tracking-[0.3em] uppercase mb-16">
          {t('title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
