import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { order: 'asc' }
  })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { type, value, order } = data

    const contact = await prisma.contact.create({
      data: {
        type,
        value,
        order: order ?? 0
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Contact create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
