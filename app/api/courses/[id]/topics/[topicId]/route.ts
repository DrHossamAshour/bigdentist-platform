import { NextRequest, NextResponse } from 'next/server'
import { mockTopics, updateMockTopics } from '@/lib/mockData'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; topicId: string } }
) {
  try {
    const courseId = params.id
    const topicId = params.topicId
    const body = await request.json()

    console.log('Updating topic:', { courseId, topicId, body })

    // Find and update the topic
    const topicIndex = mockTopics.findIndex(topic => topic.id === topicId && topic.courseId === courseId)
    if (topicIndex === -1) {
      console.log('Topic not found:', { courseId, topicId })
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    // Create updated topics array
    const updatedTopics = [...mockTopics]
    updatedTopics[topicIndex] = {
      ...updatedTopics[topicIndex],
      title: body.title,
      description: body.description
    }

    // Update the shared mock data
    updateMockTopics(updatedTopics)

    console.log('Topic updated successfully:', updatedTopics[topicIndex])

    return NextResponse.json(updatedTopics[topicIndex])
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