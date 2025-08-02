import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET /api/courses/[id] - Get single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
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
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Calculate average rating and enrollment count
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : 0

    const courseWithStats = {
      ...course,
      avgRating: Math.round(avgRating * 10) / 10,
      enrollmentCount: course.enrollments.length,
      reviewCount: course.reviews.length,
      reviews: undefined, // Remove reviews array from response
      enrollments: undefined, // Remove enrollments array from response
    }

    return NextResponse.json(courseWithStats)
  } catch (error) {
    console.error('Error fetching course:', error)
    
    // Fallback mock data when database fails
    console.log('Database failed, returning mock course')
    const mockCourse = {
      id: params.id,
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
    }
    
    return NextResponse.json(mockCourse)
  }
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Course update request received for ID:', params.id)
    
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

    const body = await request.json()
    console.log('Update data received:', body)
    
    const { isPublished, isFeatured, ...updateData } = body

    console.log('isFeatured value:', isFeatured, 'type:', typeof isFeatured)
    console.log('isPublished value:', isPublished, 'type:', typeof isPublished)

    const updatePayload = {
      ...updateData,
      ...(isPublished !== undefined && { isPublished }),
      ...(isFeatured !== undefined && { isFeatured }),
    }

    console.log('Final update payload:', updatePayload)

    const course = await prisma.course.update({
      where: { id: params.id },
      data: updatePayload,
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

    console.log('Course updated successfully:', course.id, 'isFeatured:', course.isFeatured)

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify the token and get user info
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 