import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
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

    const courseId = params.id
    const lessonId = params.lessonId
    const body = await request.json()

    // Verify the lesson belongs to a topic owned by the instructor
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        topic: {
          include: {
            course: {
              select: { instructorId: true }
            }
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    if (lesson.topic.course.instructorId !== decoded.userId && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: body.title,
        description: body.description,
        content: body.content || '',
        videoUrl: body.videoUrl,
        duration: parseInt(body.duration) || 0,
        isPublic: body.isPublic || false
      },
      include: {
        topic: true
      }
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
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

    const courseId = params.id
    const lessonId = params.lessonId

    // Verify the lesson belongs to a topic owned by the instructor
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        topic: {
          include: {
            course: {
              select: { instructorId: true }
            }
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    if (lesson.topic.course.instructorId !== decoded.userId && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.lesson.delete({
      where: { id: lessonId }
    })

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 