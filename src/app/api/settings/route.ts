import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const settings = await prisma.settings.findFirst()
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { backgroundVideo, siteTitle } = data

    const existing = await prisma.settings.findFirst()

    if (existing) {
      const updated = await prisma.settings.update({
        where: { id: existing.id },
        data: { backgroundVideo, siteTitle }
      })
      return NextResponse.json(updated)
    } else {
      const created = await prisma.settings.create({
        data: { backgroundVideo: backgroundVideo || '', siteTitle: siteTitle || 'Producer Portfolio' }
      })
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
