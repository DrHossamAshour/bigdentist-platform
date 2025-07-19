import { NextRequest, NextResponse } from 'next/server'

// Mock data for lessons - in a real app, this would come from the database
let mockLessons = [
  {
    id: '1',
    title: 'Welcome to the Course',
    description: 'Overview of what you will learn',
    videoUrl: 'https://youtube.com/watch?v=example1',
    duration: 15,
    order: 1,
    topicId: '1'
  },
  {
    id: '2',
    title: 'Course Setup',
    description: 'Setting up your development environment',
    videoUrl: 'https://youtube.com/watch?v=example2',
    duration: 20,
    order: 2,
    topicId: '1'
  },
  {
    id: '3',
    title: 'Understanding the Basics',
    description: 'Core principles and fundamentals',
    videoUrl: 'https://youtube.com/watch?v=example3',
    duration: 25,
    order: 1,
    topicId: '2'
  }
]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  try {
    const courseId = params.id
    const lessonId = params.lessonId
    const body = await request.json()

    // Find and update the lesson
    const lessonIndex = mockLessons.findIndex(lesson => lesson.id === lessonId)
    if (lessonIndex === -1) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    mockLessons[lessonIndex] = {
      ...mockLessons[lessonIndex],
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      duration: body.duration,
      topicId: body.topicId
    }

    return NextResponse.json(mockLessons[lessonIndex])
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
    const courseId = params.id
    const lessonId = params.lessonId

    // Find and remove the lesson
    const lessonIndex = mockLessons.findIndex(lesson => lesson.id === lessonId)
    if (lessonIndex === -1) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    mockLessons = mockLessons.filter(lesson => lesson.id !== lessonId)

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 