'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface GalleryPhoto {
  id: number
  url: string
  caption?: string | null
  order: number
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = useCallback(async () => {
    const res = await fetch('/api/gallery')
    const data = await res.json()
    setPhotos(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const uploadPhoto = useCallback(async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setMessage('Error: Only JPG, PNG, WebP')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage('Error: Max 10MB')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { url } = await uploadRes.json()

      const addRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (!addRes.ok) throw new Error('Failed to save')

      await fetchPhotos()
      setMessage('Photo added!')
    } catch (e) {
      setMessage(`Error: ${e instanceof Error ? e.message : 'Unknown'}`)
    } finally {
      setUploading(false)
    }
  }, [fetchPhotos])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(uploadPhoto)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadPhoto])

  const deletePhoto = useCallback(async (id: number) => {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }, [])

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wider mb-8">Gallery</h1>
      <p className="text-gray-400 text-sm mb-6">Фото рабочего процесса, отображаются в карусели на странице «Обо мне»</p>

      <div className="mb-8">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-6 py-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-500 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '+ Add Photos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP — max 10MB each. Можно выбрать несколько.</p>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
          {message}
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-gray-500">No photos yet. Add some above.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square bg-gray-800 rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || ''}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
