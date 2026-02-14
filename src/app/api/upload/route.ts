import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/data/uploads'

const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp']
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isVideo = ALLOWED_VIDEO.includes(file.type)
    const isImage = ALLOWED_IMAGE.includes(file.type)

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: mp4, webm, mov, jpg, png, webp' },
        { status: 400 }
      )
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      const limitMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { error: `File too large. Maximum: ${limitMB}MB` },
        { status: 400 }
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.jpg')
    const safeName = crypto.randomBytes(8).toString('hex') + ext
    const filePath = path.join(UPLOAD_DIR, safeName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/api/files/${safeName}`

    return NextResponse.json({ url, filename: safeName })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
