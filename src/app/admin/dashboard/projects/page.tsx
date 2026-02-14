'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: number
  titleRu: string
  titleEn: string
  descriptionRu: string | null
  descriptionEn: string | null
  youtubeUrl: string
  order: number
  visible: boolean
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    titleRu: '',
    titleEn: '',
    descriptionRu: '',
    descriptionEn: '',
    youtubeUrl: '',
    order: 0,
    visible: true
  })

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const resetForm = () => {
    setFormData({
      titleRu: '',
      titleEn: '',
      descriptionRu: '',
      descriptionEn: '',
      youtubeUrl: '',
      order: 0,
      visible: true
    })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (project: Project) => {
    setFormData({
      titleRu: project.titleRu,
      titleEn: project.titleEn,
      descriptionRu: project.descriptionRu || '',
      descriptionEn: project.descriptionEn || '',
      youtubeUrl: project.youtubeUrl,
      order: project.order,
      visible: project.visible
    })
    setEditing(project)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      resetForm()
      fetchProjects()
      router.refresh()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchProjects()
      router.refresh()
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= projects.length) return

    const current = projects[index]
    const swap = projects[swapIndex]

    await Promise.all([
      fetch(`/api/projects/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, order: swap.order })
      }),
      fetch(`/api/projects/${swap.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...swap, order: current.order })
      })
    ])

    fetchProjects()
    router.refresh()
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light tracking-wider">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
        >
          + Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-light mb-6">
              {editing ? 'Edit Project' : 'Add Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title (RU)</label>
                  <input
                    type="text"
                    value={formData.titleRu}
                    onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://vimeo.com/... or https://youtube.com/..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description (RU)</label>
                <textarea
                  value={formData.descriptionRu}
                  onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description (EN)</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50 resize-none"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>Visible</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  {editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects yet. Add your first project!</p>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg p-4 flex items-center gap-4"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
                  title="Move up"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === projects.length - 1}
                  className="p-1 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
                  title="Move down"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  <h3 className="font-medium">{project.titleRu}</h3>
                  {!project.visible && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">{project.titleEn}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
