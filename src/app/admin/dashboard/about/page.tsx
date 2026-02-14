'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AboutData {
  id?: number
  titleRu: string
  titleEn: string
  subtitleRu: string
  subtitleEn: string
  bioRu: string
  bioEn: string
  photoUrl: string
}

export default function AboutPage() {
  const router = useRouter()
  const [data, setData] = useState<AboutData>({
    titleRu: '',
    titleEn: '',
    subtitleRu: '',
    subtitleEn: '',
    bioRu: '',
    bioEn: '',
    photoUrl: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setData({
            id: result.id,
            titleRu: result.titleRu || '',
            titleEn: result.titleEn || '',
            subtitleRu: result.subtitleRu || '',
            subtitleEn: result.subtitleEn || '',
            bioRu: result.bioRu || '',
            bioEn: result.bioEn || '',
            photoUrl: result.photoUrl || ''
          })
        }
        setLoading(false)
      })
  }, [])

  const uploadPhoto = useCallback(async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setMessage('Error: Only JPG, PNG, and WebP files are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Error: File size must be under 10MB')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      const result = await res.json()
      setData((prev) => ({ ...prev, photoUrl: result.url }))
      setMessage('Photo uploaded! Click "Save Changes" to apply.')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`)
    } finally {
      setUploading(false)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadPhoto(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadPhoto])

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
            <label className="block text-sm text-gray-400 mb-2">Hero Title (Russian)</label>
            <input
              type="text"
              value={data.titleRu}
              onChange={(e) => setData({ ...data, titleRu: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Shown on the main hero screen</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Hero Title (English)</label>
            <input
              type="text"
              value={data.titleEn}
              onChange={(e) => setData({ ...data, titleEn: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Shown on the main hero screen</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">About Title (Russian)</label>
            <input
              type="text"
              value={data.subtitleRu}
              onChange={(e) => setData({ ...data, subtitleRu: e.target.value })}
              placeholder="e.g. Владислав Максимов"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in the About section</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">About Title (English)</label>
            <input
              type="text"
              value={data.subtitleEn}
              onChange={(e) => setData({ ...data, subtitleEn: e.target.value })}
              placeholder="e.g. Vladislav Maksimov"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
            />
            <p className="text-xs text-gray-500 mt-1">Shown in the About section</p>
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
          <label className="block text-sm text-gray-400 mb-2">Photo</label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-500 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Choose Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP — max 10MB</p>

              {data.photoUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Current: <code className="bg-gray-700 px-2 py-0.5 rounded">{data.photoUrl}</code>
                  </p>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, photoUrl: '' })}
                    className="mt-1 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove photo
                  </button>
                </div>
              )}
            </div>

            {data.photoUrl && (
              <div className="w-32 h-40 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
