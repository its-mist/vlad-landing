'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AboutData {
  id?: number
  titleRu: string
  titleEn: string
  bioRu: string
  bioEn: string
  photoUrl: string
}

export default function AboutPage() {
  const router = useRouter()
  const [data, setData] = useState<AboutData>({
    titleRu: '',
    titleEn: '',
    bioRu: '',
    bioEn: '',
    photoUrl: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setData({
            id: result.id,
            titleRu: result.titleRu || '',
            titleEn: result.titleEn || '',
            bioRu: result.bioRu || '',
            bioEn: result.bioEn || '',
            photoUrl: result.photoUrl || ''
          })
        }
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setMessage('Saved successfully!')
        router.refresh()
      } else {
        setMessage('Error saving data')
      }
    } catch {
      setMessage('Error saving data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wider mb-8">About Section</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title (Russian)</label>
            <input
              type="text"
              value={data.titleRu}
              onChange={(e) => setData({ ...data, titleRu: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Title (English)</label>
            <input
              type="text"
              value={data.titleEn}
              onChange={(e) => setData({ ...data, titleEn: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Bio (Russian)</label>
          <textarea
            value={data.bioRu}
            onChange={(e) => setData({ ...data, bioRu: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Bio (English)</label>
          <textarea
            value={data.bioEn}
            onChange={(e) => setData({ ...data, bioEn: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Photo URL (optional)</label>
          <input
            type="url"
            value={data.photoUrl}
            onChange={(e) => setData({ ...data, photoUrl: e.target.value })}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
          />
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
