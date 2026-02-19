import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { order: 'asc' }
  })
  return NextResponse.json(photos)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { url, caption } = body

  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const count = await prisma.galleryPhoto.count()
  const photo = await prisma.galleryPhoto.create({
    data: { url, caption: caption || null, order: count }
  })
  return NextResponse.json(photo)
}
