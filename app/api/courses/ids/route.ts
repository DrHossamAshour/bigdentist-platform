import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/ids - Get all course IDs and titles for dropdown
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: any = {
      isPublished: true // Only show published courses
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const courses = await prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching course IDs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 