// Centralized mock data for topics - shared between all topic routes
export let mockTopics = [
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

// Helper function to update topics
export function updateMockTopics(newTopics: typeof mockTopics) {
  mockTopics.length = 0
  mockTopics.push(...newTopics)
} 