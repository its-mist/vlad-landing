'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsData {
  id?: number
  backgroundVideo: string
  siteTitle: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [data, setData] = useState<SettingsData>({
    backgroundVideo: '',
    siteTitle: 'Producer Portfolio'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setData({
            id: result.id,
            backgroundVideo: result.backgroundVideo || '',
            siteTitle: result.siteTitle || 'Producer Portfolio'
          })
        }
        setLoading(false)
      })
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setMessage('Error: Only MP4, WebM, and MOV files are allowed')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      setMessage('Error: File size must be under 100MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<{ url: string }>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            const err = JSON.parse(xhr.responseText)
            reject(new Error(err.error || 'Upload failed'))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Upload failed')))
        xhr.open('POST', '/api/upload')
        xhr.send(formData)
      })

      const result = await uploadPromise
      setData((prev) => ({ ...prev, backgroundVideo: result.url }))
      setMessage('Video uploaded! Click "Save Settings" to apply.')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [uploadFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setMessage('Settings saved successfully!')
        router.refresh()
      } else {
        setMessage('Error saving settings')
      }
    } catch {
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-light tracking-wider mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Site Title</label>
          <input
            type="text"
            value={data.siteTitle}
            onChange={(e) => setData({ ...data, siteTitle: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Background Video</label>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-white/60 bg-white/5'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-gray-400">
              <p className="text-lg mb-2">
                {uploading ? 'Uploading...' : 'Drop video here or click to select'}
              </p>
              <p className="text-xs text-gray-500">
                MP4, WebM, MOV — max 100MB
              </p>
            </div>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
            </div>
          )}

          {/* Current value */}
          {data.backgroundVideo && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">
                Current: <code className="bg-gray-700 px-2 py-0.5 rounded">{data.backgroundVideo}</code>
              </p>
              <video
                src={data.backgroundVideo}
                className="w-full max-h-48 rounded object-cover"
                muted
                autoPlay
                loop
                playsInline
              />
              <button
                type="button"
                onClick={() => setData({ ...data, backgroundVideo: '' })}
                className="mt-2 text-xs text-red-400 hover:text-red-300"
              >
                Remove video
              </button>
            </div>
          )}
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
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
