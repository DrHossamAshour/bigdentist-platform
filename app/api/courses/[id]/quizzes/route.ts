import { NextRequest, NextResponse } from 'next/server'

// Mock data for quizzes - in a real app, this would come from the database
const mockQuizzes = [
  {
    id: '1',
    title: 'Introduction Quiz',
    description: 'Test your understanding of the course basics',
    questions: 10,
    timeLimit: 30,
    passingScore: 70,
    topicId: '1'
  },
  {
    id: '2',
    title: 'Core Concepts Assessment',
    description: 'Evaluate your knowledge of fundamental concepts',
    questions: 15,
    timeLimit: 45,
    passingScore: 80,
    topicId: '2'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    // For now, return mock data
    // In a real app, you would fetch from the database
    return NextResponse.json(mockQuizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
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

    // For now, return a mock response
    // In a real app, you would save to the database
    const newQuiz = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      questions: body.questions,
      timeLimit: body.timeLimit,
      passingScore: body.passingScore,
      topicId: body.topicId
    }

    return NextResponse.json(newQuiz, { status: 201 })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 