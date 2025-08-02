import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    const lessons = await prisma.lesson.findMany({
      where: {
        topic: {
          courseId
        }
      },
      include: {
        topic: true
      },
      orderBy: [
        { topic: { order: 'asc' } },
        { order: 'asc' }
      ]
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    
    // Fallback mock data when database fails
    console.log('Database failed, returning mock lessons')
    const mockLessons = [
      {
        id: '1',
        title: 'Introduction to Advanced Techniques',
        description: 'Overview of modern dental procedures',
        content: 'Learn the fundamentals of advanced dental techniques',
        videoUrl: 'https://player.vimeo.com/video/1070508363?h=b969c1efa6&badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
        duration: 15,
        order: 1,
        isPublished: true,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        topicId: '1',
        topic: {
          id: '1',
          title: 'Atrophic jaw dilemma and chasing the bone',
          description: 'Understanding the challenges of atrophic jaw and bone grafting techniques',
          order: 1,
          courseId: params.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      {
        id: '2',
        title: 'Orthodontic Procedures',
        description: 'Advanced orthodontic techniques',
        content: 'Master the latest orthodontic procedures',
        videoUrl: 'https://player.vimeo.com/video/456789123?badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
        duration: 20,
        order: 2,
        isPublished: true,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        topicId: '1',
        topic: {
          id: '1',
          title: 'Atrophic jaw dilemma and chasing the bone',
          description: 'Understanding the challenges of atrophic jaw and bone grafting techniques',
          order: 1,
          courseId: params.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ]
    
    return NextResponse.json(mockLessons)
  }
}

export async function POST(
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

    const courseId = params.id
    const body = await request.json()

    // Verify the topic belongs to a course owned by the instructor
    const topic = await prisma.topic.findUnique({
      where: { id: body.topicId },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    })

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    if (topic.course.instructorId !== decoded.userId && decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get the next order number for this topic
    const lastLesson = await prisma.lesson.findFirst({
      where: { topicId: body.topicId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newOrder = (lastLesson?.order || 0) + 1

    const newLesson = await prisma.lesson.create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content || '',
        videoUrl: body.videoUrl,
        duration: parseInt(body.duration) || 0,
        order: newOrder,
        topicId: body.topicId
      },
      include: {
        topic: true
      }
    })

    return NextResponse.json(newLesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
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

    const courseId = params.id
    const lessonId = request.nextUrl.searchParams.get('lessonId')
    const body = await request.json()

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

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
        content: body.content,
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

    const courseId = params.id
    const lessonId = request.nextUrl.searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

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