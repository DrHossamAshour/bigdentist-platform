import { NextRequest, NextResponse } from 'next/server'

// Mock data for topics - shared between all topic routes
let mockTopics = [
  {
    id: '1',
    title: 'Atrophic jaw dilemma and chasing the bone',
    description: 'Understanding the challenges of atrophic jaw and bone grafting techniques',
    order: 1,
    courseId: 'cmdtim0et0001q2766rwh3xm7',
    lessons: [
      {
        id: '1',
        title: 'Introduction to Atrophic Jaw',
        description: 'Overview of atrophic jaw conditions',
        videoUrl: 'https://vimeo.com/123456789',
        duration: 15,
        order: 1,
        topicId: '1'
      },
      {
        id: '2',
        title: 'Bone Grafting Techniques',
        description: 'Advanced bone grafting methods',
        videoUrl: 'https://vimeo.com/987654321',
        duration: 20,
        order: 2,
        topicId: '1'
      },
      {
        id: '3',
        title: 'Case Studies',
        description: 'Real-world applications and outcomes',
        videoUrl: 'https://vimeo.com/456789123',
        duration: 25,
        order: 3,
        topicId: '1'
      }
    ]
  },
  {
    id: '2',
    title: 'Planing',
    description: 'Comprehensive planning strategies for complex cases',
    order: 2,
    courseId: 'cmdtim0et0001q2766rwh3xm7',
    lessons: [
      {
        id: '4',
        title: 'Treatment Planning Basics',
        description: 'Fundamentals of treatment planning',
        videoUrl: 'https://vimeo.com/111222333',
        duration: 18,
        order: 1,
        topicId: '2'
      }
    ]
  },
  {
    id: '3',
    title: 'Applied',
    description: 'Practical applications and hands-on techniques',
    order: 3,
    courseId: 'cmdtim0et0001q2766rwh3xm7',
    lessons: []
  },
  {
    id: '4',
    title: 'Serious Webinar (10 hours)',
    description: 'Comprehensive webinar covering advanced topics',
    order: 4,
    courseId: 'cmdtim0et0001q2766rwh3xm7',
    lessons: [
      {
        id: '5',
        title: 'Advanced Techniques Part 1',
        description: 'First part of advanced techniques',
        videoUrl: 'https://vimeo.com/444555666',
        duration: 60,
        order: 1,
        topicId: '4'
      },
      {
        id: '6',
        title: 'Advanced Techniques Part 2',
        description: 'Second part of advanced techniques',
        videoUrl: 'https://vimeo.com/777888999',
        duration: 60,
        order: 2,
        topicId: '4'
      }
    ]
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    console.log('Fetching topics for course:', courseId)
    
    // Filter topics for this specific course
    const courseTopics = mockTopics.filter(topic => topic.courseId === courseId)
    console.log('Found topics:', courseTopics.length)
    
    return NextResponse.json(courseTopics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const body = await request.json()

    // Get the next order number
    const courseTopics = mockTopics.filter(topic => topic.courseId === courseId)
    const lastTopic = courseTopics[courseTopics.length - 1]
    const newOrder = (lastTopic?.order || 0) + 1

    const newTopic = {
      id: Date.now().toString(), // Simple ID generation
      title: body.title,
      description: body.description,
      order: newOrder,
      courseId,
      lessons: []
    }

    mockTopics.push(newTopic)

    return NextResponse.json(newTopic, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const topicId = request.nextUrl.searchParams.get('topicId')
    const body = await request.json()

    console.log('PUT request - updating topic:', { courseId, topicId, body })

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 })
    }

    // Find and update the topic
    const topicIndex = mockTopics.findIndex(topic => topic.id === topicId && topic.courseId === courseId)
    if (topicIndex === -1) {
      console.log('Topic not found in main route:', { courseId, topicId })
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    console.log('Updating topic at index:', topicIndex)
    mockTopics[topicIndex] = {
      ...mockTopics[topicIndex],
      title: body.title,
      description: body.description
    }

    console.log('Topic updated successfully in main route:', mockTopics[topicIndex])

    return NextResponse.json(mockTopics[topicIndex])
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const topicId = request.nextUrl.searchParams.get('topicId')

    if (!topicId) {
      return NextResponse.json({ error: 'Topic ID required' }, { status: 400 })
    }

    // Find and remove the topic
    const topicIndex = mockTopics.findIndex(topic => topic.id === topicId && topic.courseId === courseId)
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