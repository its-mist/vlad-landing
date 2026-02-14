'use client'

import { useTranslations } from 'next-intl'
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

function getEmbedUrl(url: string): string {
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  return url
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
        <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase mb-16">
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
              <div className="relative aspect-video overflow-hidden bg-gray-800 rounded-lg">
                <iframe
                  src={getEmbedUrl(project.youtubeUrl)}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
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
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
