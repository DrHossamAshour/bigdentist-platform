'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { 
  Play, 
  Clock, 
  Star, 
  User, 
  CheckCircle, 
  Lock,
  BookOpen,
  Download,
  Share2,
  Heart,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  duration: number
  isCompleted: boolean
  isLocked: boolean
  videoUrl?: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  rating: number
  reviewCount: number
  duration: number
  lessonCount: number
  price: number
  originalPrice?: number
  category: string
  level: string
  thumbnail: string
  videoUrl?: string
  content: string
  isEnrolled: boolean
  progress: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCourse: Course = {
      id: courseId,
      title: 'Complete React Developer Course 2024',
      description: 'Learn React from scratch with this comprehensive course. Build real-world projects and master modern React development.',
      instructor: 'John Doe',
      instructorAvatar: '👨‍💻',
      rating: 4.8,
      reviewCount: 1247,
      duration: 15,
      lessonCount: 24,
      price: 89.99,
      originalPrice: 199.99,
      category: 'Programming',
      level: 'Intermediate',
      thumbnail: '🎨',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: 'This comprehensive React course covers everything from basics to advanced concepts...',
      isEnrolled: false,
      progress: 0
    }

    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Introduction to React',
        duration: 15,
        isCompleted: false,
        isLocked: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '2',
        title: 'Setting up your development environment',
        duration: 20,
        isCompleted: false,
        isLocked: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '3',
        title: 'Understanding JSX',
        duration: 25,
        isCompleted: false,
        isLocked: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '4',
        title: 'Components and Props',
        duration: 30,
        isCompleted: false,
        isLocked: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '5',
        title: 'State and Lifecycle',
        duration: 35,
        isCompleted: false,
        isLocked: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]

    setCourse(mockCourse)
    setLessons(mockLessons)
    setCurrentLesson(mockLessons[0])
    setLoading(false)
  }, [courseId])

  const handleEnroll = () => {
    // In real app, redirect to payment or enrollment API
    setCourse(prev => prev ? { ...prev, isEnrolled: true } : null)
  }

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      setCurrentLesson(lesson)
      setIsPlaying(true)
      setIsPaused(false)
      setTimeout(() => {
        videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/courses" className="text-primary-600 hover:text-primary-700">
            Browse all courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/courses" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div ref={videoRef} className="bg-black rounded-lg overflow-hidden mb-6 relative">
              <div className="aspect-video">
                {isPlaying && currentLesson?.videoUrl ? (
                  <>
                    <iframe
                      src={currentLesson.videoUrl + (isPaused ? '' : '?autoplay=1')}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                    {/* Play/Pause Button Overlay (simulated for iframe) */}
                    <button
                      onClick={() => setIsPaused((prev) => !prev)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-4 shadow-lg focus:outline-none"
                      style={{ zIndex: 10 }}
                    >
                      {isPaused ? (
                        <Play className="w-8 h-8 text-primary-600" />
                      ) : (
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{course.thumbnail}</div>
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Preview Course
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Lesson Details Below Video */}
              {currentLesson && (
                <div className="bg-white bg-opacity-90 px-6 py-4 border-t flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{currentLesson.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span><Clock className="inline w-4 h-4 mr-1" /> {currentLesson.duration} min</span>
                      {currentLesson.isCompleted && <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Completed</span>}
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {currentLesson.isLocked ? 'Locked' : 'Available'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 text-lg">{course.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span>{course.rating} ({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.lessonCount} lessons</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {course.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{course.content}</p>
              </div>
            </div>

            {/* Course Curriculum - moved from sidebar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
              <p className="text-sm text-gray-600 mt-1 mb-4">{course.lessonCount} lessons • {course.duration}h total length</p>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="relative group">
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      disabled={lesson.isLocked}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        lesson.isLocked
                          ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          : currentLesson?.id === lesson.id
                          ? 'bg-primary-50 border-primary-600 ring-2 ring-primary-200'
                          : lesson.isCompleted
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {lesson.isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : lesson.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Play className={`w-4 h-4 ${currentLesson?.id === lesson.id ? 'text-primary-600' : 'text-gray-600'}`} />
                          )}
                          <div>
                            <p className={`text-sm font-medium ${
                              lesson.isLocked ? 'text-gray-500' : currentLesson?.id === lesson.id ? 'text-primary-800' : 'text-gray-900'
                            }`}>
                              {index + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500">{lesson.duration} min</p>
                          </div>
                        </div>
                      </div>
                    </button>
                    {lesson.isLocked && (
                      <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full z-20 hidden group-hover:block pointer-events-none">
                        <div className="bg-black text-white text-xs rounded px-3 py-2 shadow-lg whitespace-nowrap">
                          You must enroll in the course to watch this lesson.
                        </div>
                        <div className="w-3 h-3 bg-black rotate-45 absolute left-1/2 -translate-x-1/2 top-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{course.thumbnail}</div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                  {course.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
                  )}
                </div>
                {course.originalPrice && (
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                  </span>
                )}
              </div>

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Enrolled</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">{course.progress}% complete</p>
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Continue Learning
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Enroll Now
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors">
                    Add to Wishlist
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-600" />
                    {course.duration} hours on-demand video
                  </li>
                  <li className="flex items-center">
                    <Download className="w-4 h-4 mr-2 text-green-600" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                    Full lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 