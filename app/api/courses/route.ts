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
    
    // Fallback mock data when database fails
    console.log('Database failed, returning mock courses')
    const mockCourses = [
      {
        id: 'cmdtim0et0001q2766rwh3xm7',
        title: 'Advanced Dental Techniques',
        description: 'Comprehensive course covering modern dental procedures and techniques',
        content: 'This course provides in-depth training on advanced dental techniques including orthodontics, cosmetic dentistry, and surgical procedures.',
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
        videoUrl: 'https://player.vimeo.com/video/1070508363?h=b969c1efa6&badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
        duration: 1500, // 25 hours in minutes
        price: 299,
        originalPrice: 399,
        category: 'Dentistry',
        level: 'Advanced',
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        instructorId: 'mock-instructor-1',
        instructor: {
          id: 'mock-instructor-1',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
        },
        tags: [],
        avgRating: 4.8,
        enrollmentCount: 156,
        reviewCount: 89
      },
      {
        id: 'cmdtim0et0002q2766rwh3xm8',
        title: 'Modern Orthodontics',
        description: 'Learn the latest orthodontic techniques and treatment planning',
        content: 'Master modern orthodontic procedures including clear aligners, braces, and surgical orthodontics.',
        thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=250&fit=crop',
        videoUrl: 'https://player.vimeo.com/video/456789123?badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
        duration: 1200, // 20 hours in minutes
        price: 249,
        originalPrice: 349,
        category: 'Orthodontics',
        level: 'Intermediate',
        isPublished: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        instructorId: 'mock-instructor-2',
        instructor: {
          id: 'mock-instructor-2',
          firstName: 'Dr. Michael',
          lastName: 'Chen',
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
        },
        tags: [],
        avgRating: 4.9,
        enrollmentCount: 203,
        reviewCount: 127
      }
    ]
    
    return NextResponse.json(mockCourses)
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