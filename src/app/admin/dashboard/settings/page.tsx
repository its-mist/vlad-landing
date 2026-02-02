'use client'

import { useEffect, useState } from 'react'
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
          <label className="block text-sm text-gray-400 mb-2">Background Video URL</label>
          <input
            type="text"
            value={data.backgroundVideo}
            onChange={(e) => setData({ ...data, backgroundVideo: e.target.value })}
            placeholder="/videos/background.mp4 or https://..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-white/50"
          />
          <p className="text-xs text-gray-500 mt-2">
            Leave empty to use gradient background. You can upload a video to /public/videos/ folder
            or use an external URL.
          </p>
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
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <div className="mt-12 p-6 bg-gray-800/50 rounded-lg">
        <h2 className="text-lg font-light mb-4">Video Upload Instructions</h2>
        <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
          <li>Place your video file in the <code className="bg-gray-700 px-2 py-1 rounded">/public/videos/</code> folder</li>
          <li>Enter the path in the field above, e.g., <code className="bg-gray-700 px-2 py-1 rounded">/videos/background.mp4</code></li>
          <li>Recommended: MP4 format, 1080p resolution, under 50MB for optimal loading</li>
        </ol>
      </div>
    </div>
  )
}
