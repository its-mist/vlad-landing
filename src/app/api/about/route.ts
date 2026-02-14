import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const about = await prisma.about.findFirst()
  return NextResponse.json(about)
}

export async function PUT(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { titleRu, titleEn, subtitleRu, subtitleEn, bioRu, bioEn, photoUrl } = data

    const existing = await prisma.about.findFirst()

    if (existing) {
      const updated = await prisma.about.update({
        where: { id: existing.id },
        data: { titleRu, titleEn, subtitleRu, subtitleEn, bioRu, bioEn, photoUrl }
      })
      return NextResponse.json(updated)
    } else {
      const created = await prisma.about.create({
        data: { titleRu, titleEn, subtitleRu: subtitleRu || '', subtitleEn: subtitleEn || '', bioRu, bioEn, photoUrl }
      })
      return NextResponse.json(created)
    }
  } catch (error) {
    console.error('About update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
