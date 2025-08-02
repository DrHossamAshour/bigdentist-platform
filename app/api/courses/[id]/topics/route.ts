import { NextRequest, NextResponse } from 'next/server'
import { mockTopics, updateMockTopics } from '@/lib/mockData'

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

    // Create updated topics array with new topic
    const updatedTopics = [...mockTopics, newTopic]
    updateMockTopics(updatedTopics)

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
    
    // Create updated topics array
    const updatedTopics = [...mockTopics]
    updatedTopics[topicIndex] = {
      ...updatedTopics[topicIndex],
      title: body.title,
      description: body.description
    }

    // Update the shared mock data
    updateMockTopics(updatedTopics)

    console.log('Topic updated successfully in main route:', updatedTopics[topicIndex])

    return NextResponse.json(updatedTopics[topicIndex])
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

    // Create updated topics array without the deleted topic
    const updatedTopics = mockTopics.filter(topic => topic.id !== topicId)
    updateMockTopics(updatedTopics)

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 