import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' }
  })
  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { titleRu, titleEn, descriptionRu, descriptionEn, youtubeUrl, order, visible } = data

    const project = await prisma.project.create({
      data: {
        titleRu,
        titleEn,
        descriptionRu,
        descriptionEn,
        youtubeUrl,
        order: order ?? 0,
        visible: visible ?? true
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
