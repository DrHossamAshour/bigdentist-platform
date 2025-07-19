import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/courses - Get all courses with filters
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching courses...')
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')

    const where: any = {}

    if (category) where.category = category
    if (level) where.level = level
    if (featured === 'true') where.isFeatured = true
    if (published === 'true') where.isPublished = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    console.log('Database query where clause:', where)

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`Found ${courses.length} courses in database`)

    // Calculate average rating and enrollment count
    const coursesWithStats = courses.map(course => {
      const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0

      return {
        ...course,
        avgRating: Math.round(avgRating * 10) / 10,
        enrollmentCount: course.enrollments.length,
        reviewCount: course.reviews.length,
        reviews: undefined, // Remove reviews array from response
        enrollments: undefined, // Remove enrollments array from response
      }
    })

    console.log('Returning courses with stats:', coursesWithStats.length)

    return NextResponse.json(coursesWithStats)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create new course (Admin/Instructor only)
export async function POST(request: NextRequest) {
  try {
    console.log('Course creation request received')
    
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      console.log('No auth token found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the token and get user info
    const decoded = verifyToken(token)
    if (!decoded) {
      console.log('Invalid token')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    console.log('User authenticated:', decoded.userId)

    const body = await request.json()
    console.log('Course data received:', body)
    
    const {
      title,
      description,
      content,
      thumbnail,
      videoUrl,
      duration,
      price,
      originalPrice,
      category,
      level,
      tagIds,
      isFeatured,
    } = body

    if (!title || !description || !price) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating course with instructorId:', decoded.userId)

    const course = await prisma.course.create({
      data: {
        title,
        description,
        content,
        thumbnail,
        videoUrl,
        duration: parseInt(duration) || 0,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        level: level || 'BEGINNER',
        instructorId: decoded.userId, // Use the logged-in user's ID
        isPublished: true, // Set as published by default
        isFeatured: isFeatured || false, // Set featured status
        tags: tagIds ? {
          connect: tagIds.map((id: string) => ({ id })),
        } : undefined,
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        tags: true,
      },
    })

    console.log('Course created successfully:', course.id)

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 