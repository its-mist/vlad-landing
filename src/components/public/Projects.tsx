'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
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
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`,
    }
  }

  return { embedUrl: url, thumbnailUrl: '' }
}

function ProjectCard({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false)
  const { embedUrl, thumbnailUrl } = getVideoInfo(project.youtubeUrl)

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
          <p className="text-white/50 mt-2 text-sm">
            {project.description}
          </p>
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

        <div className="grid md:grid-cols-2 gap-8">
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
