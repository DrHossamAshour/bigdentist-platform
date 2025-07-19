import { NextRequest, NextResponse } from 'next/server'

// Mock data for topics - in a real app, this would come from the database
let mockTopics = [
  {
    id: '1',
    title: 'Introduction to the Course',
    description: 'Get started with the fundamentals',
    order: 1,
    lessons: [
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
      }
    ]
  },
  {
    id: '2',
    title: 'Core Concepts',
    description: 'Learn the essential concepts',
    order: 2,
    lessons: [
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
  }
]

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const courseId = params.id
    const topicId = params.topicId
    const body = await request.json()

    // Find and update the topic
    const topicIndex = mockTopics.findIndex(topic => topic.id === topicId)
    if (topicIndex === -1) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    mockTopics[topicIndex] = {
      ...mockTopics[topicIndex],
      title: body.title,
      description: body.description
    }

    return NextResponse.json(mockTopics[topicIndex])
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const courseId = params.id
    const topicId = params.topicId

    // Find and remove the topic
    const topicIndex = mockTopics.findIndex(topic => topic.id === topicId)
    if (topicIndex === -1) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    mockTopics = mockTopics.filter(topic => topic.id !== topicId)

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 