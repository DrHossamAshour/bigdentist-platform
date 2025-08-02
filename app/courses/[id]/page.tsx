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
  isPublic?: boolean
  videoUrl?: string
  description?: string
  content?: string
  order: number
  topicId: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    firstName: string
    lastName: string
    avatar?: string
  }
  rating: number
  reviewCount: number
  duration: number
  lessonCount: number
  price: number
  originalPrice?: number
  category: string
  level: string
  thumbnail?: string
  videoUrl?: string
  content: string
  isEnrolled: boolean
  progress: number
  avgRating?: number
  enrollmentCount?: number
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
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>('')
  const [embedLoading, setEmbedLoading] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`)
      let courseData
      
      if (!courseResponse.ok) {
        console.warn('Course API failed, using mock data')
        // Fallback mock data with proper URLs
        courseData = {
          id: courseId,
          title: 'Advanced Dental Techniques',
          description: 'Comprehensive course covering modern dental procedures and techniques',
          content: 'This course provides in-depth training on advanced dental techniques including orthodontics, cosmetic dentistry, and surgical procedures.',
          instructor: {
            firstName: 'Dr. Sarah',
            lastName: 'Johnson',
            avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
          },
          avgRating: 4.8,
          reviewCount: 156,
          duration: 25,
          price: 299,
          originalPrice: 399,
          category: 'Dentistry',
          level: 'Advanced',
          thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
          videoUrl: 'https://player.vimeo.com/video/1070508363?h=b969c1efa6&badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0'
        }
      } else {
        courseData = await courseResponse.json()
      }
      
      // Fetch lessons for this course
      const lessonsResponse = await fetch(`/api/courses/${courseId}/lessons`)
      let lessonsData: Lesson[] = []
      if (lessonsResponse.ok) {
        const rawLessons = await lessonsResponse.json()
        // Transform lessons to match our interface
        lessonsData = rawLessons.map((lesson: any) => {
          const transformedLesson = {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            order: lesson.order,
            topicId: lesson.topicId,
            isPublic: lesson.isPublic || false,
            isCompleted: false, // This would come from user progress in a real app
            isLocked: !lesson.isPublic // Locked if not public (public lessons are always unlocked)
          }
          console.log(`Lesson "${lesson.title}":`, {
            isPublic: transformedLesson.isPublic,
            isLocked: transformedLesson.isLocked,
            videoUrl: transformedLesson.videoUrl
          })
          return transformedLesson
        })
      } else {
        console.warn('Lessons API failed, using mock lessons')
        // Fallback mock lessons
        lessonsData = [
          {
            id: '1',
            title: 'Introduction to Advanced Techniques',
            description: 'Overview of modern dental procedures',
            content: 'Learn the fundamentals of advanced dental techniques',
            videoUrl: 'https://player.vimeo.com/video/1070508363?h=b969c1efa6&badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
            duration: 15,
            order: 1,
            topicId: '1',
            isPublic: true,
            isCompleted: false,
            isLocked: false
          },
          {
            id: '2',
            title: 'Orthodontic Procedures',
            description: 'Advanced orthodontic techniques',
            content: 'Master the latest orthodontic procedures',
            videoUrl: 'https://player.vimeo.com/video/456789123?badge=0&title=0&byline=0&portrait=0&dnt=1&autopause=0&download=0&pip=0&fullscreen=0',
            duration: 20,
            order: 2,
            topicId: '1',
            isPublic: false,
            isCompleted: false,
            isLocked: true
          }
        ]
      }

      // Transform course data to match our interface
      const transformedCourse: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        instructor: {
          firstName: courseData.instructor.firstName,
          lastName: courseData.instructor.lastName,
          avatar: courseData.instructor.avatar
        },
        rating: courseData.avgRating || 0,
        reviewCount: courseData.reviewCount || 0,
        duration: courseData.duration,
        lessonCount: lessonsData.length,
        price: courseData.price,
        originalPrice: courseData.originalPrice,
        category: courseData.category,
        level: courseData.level,
        thumbnail: courseData.thumbnail,
        videoUrl: courseData.videoUrl,
        content: courseData.content,
        isEnrolled: false, // This would come from enrollment status
        progress: 0 // This would come from user progress
      }

      setCourse(transformedCourse)
      setLessons(lessonsData)
      
      // Auto-select first available lesson and load its video
      if (lessonsData.length > 0) {
        // Find the first available lesson (public or unlocked)
        const firstAvailableLesson = lessonsData.find(lesson => lesson.isPublic || !lesson.isLocked)
        
        if (firstAvailableLesson) {
          setCurrentLesson(firstAvailableLesson)
          setIsPlaying(true)
          
          // Load the first available lesson's video immediately
          if (firstAvailableLesson.videoUrl) {
            updateEmbedUrl(firstAvailableLesson.videoUrl)
          } else if (courseData.videoUrl) {
            // Fallback to course preview video
            updateEmbedUrl(courseData.videoUrl)
          }
        } else if (courseData.videoUrl) {
          // If no available lessons, load course preview video
          updateEmbedUrl(courseData.videoUrl)
        }
      } else if (courseData.videoUrl) {
        // If no lessons, load course preview video
        updateEmbedUrl(courseData.videoUrl)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
    setLoading(false)
    }
  }

  const handleEnroll = () => {
    // In real app, redirect to payment or enrollment API
    setCourse(prev => prev ? { ...prev, isEnrolled: true } : null)
  }

  const handleLessonClick = (lesson: Lesson) => {
    console.log('Lesson clicked:', lesson)
    setCurrentLesson(lesson)
    setIsPlaying(true)
    setIsPaused(false)
    
    // Update embed URL for the selected lesson
    updateEmbedUrl(lesson.videoUrl || course?.videoUrl || '')
  }

  const updateEmbedUrl = async (videoUrl: string) => {
    if (!videoUrl) {
      setCurrentEmbedUrl('')
      return
    }
    
    setEmbedLoading(true)
    try {
      const embedUrl = await getEmbedUrl(videoUrl)
      setCurrentEmbedUrl(embedUrl)
      console.log('Updated embed URL:', embedUrl)
    } catch (error) {
      console.error('Error updating embed URL:', error)
      setCurrentEmbedUrl('')
    } finally {
      setEmbedLoading(false)
    }
  }

  // Function to convert video URLs to embed URLs
  const getEmbedUrl = async (url: string): Promise<string> => {
    if (!url) return ''
    
    console.log('Original URL:', url)
    
    // Handle Vimeo URLs with enhanced API support
    if (url.includes('vimeo.com')) {
      try {
        // Use the new Vimeo Pro API endpoint with protection settings
        const response = await fetch('/api/vimeo/embed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            videoUrl: url,
            protected: true, // Enable protection for course content
            domain: window.location.hostname // Current domain for restriction
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Vimeo API response:', data)
          return data.embedUrl
        } else {
          console.warn('Vimeo API failed, falling back to protected embed')
        }
      } catch (error) {
        console.error('Vimeo API error:', error)
      }

      // Fallback to protected Vimeo embed
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1] || 
                     url.match(/vimeo\.com\/video\/(\d+)/)?.[1] ||
                     url.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1]
      
      console.log('Extracted video ID:', videoId)
      
      if (videoId) {
        // Protected Vimeo embed URL with domain restrictions and privacy settings
        const embedUrl = `https://player.vimeo.com/video/${videoId}?badge=0&title=0&byline=0&portrait=0&dnt=1&transparent=0&autopause=0&download=0&pip=0&fullscreen=0&domain=${window.location.hostname}`
        console.log('Generated protected embed URL:', embedUrl)
        return embedUrl
      }
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/youtube\.com\/watch\?v=([^&]+)/)?.[1] ||
                     url.match(/youtube\.com\/embed\/([^?]+)/)?.[1] ||
                     url.match(/youtu\.be\/([^?]+)/)?.[1]
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
      }
    }
    
    // If it's already an embed URL, return as is
    if (url.includes('player.vimeo.com') || url.includes('youtube.com/embed')) {
      return url
    }
    
    return url
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
                {(currentLesson?.videoUrl || course.videoUrl) ? (
                  <>
                    {embedLoading ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p className="text-white">Loading video...</p>
                        </div>
                      </div>
                    ) : currentEmbedUrl ? (
                      <iframe
                        src={currentEmbedUrl + (isPlaying && !isPaused ? '&autoplay=1' : '')}
                        title={currentLesson?.title || course.title}
                        className="w-full h-full"
                        allowFullScreen
                        allow="autoplay; fullscreen; picture-in-picture"
                        onError={(e) => {
                          console.error('Video iframe error:', e)
                        }}
                        onLoad={() => {
                          console.log('Video iframe loaded successfully')
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault() // Disable right-click context menu
                          return false
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-white text-lg mb-4">Video not available</p>
                          <p className="text-gray-400 text-sm">Please check the video URL</p>
                        </div>
                      </div>
                    )}
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
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`${course.thumbnail ? 'hidden' : ''} text-center`}>
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-white text-lg mb-4">Select a lesson to start watching</p>
                      </div>
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
                      {currentLesson.isPublic ? 'Public' : currentLesson.isLocked ? 'Locked' : 'Available'}
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
                  <span>{course.instructor.firstName} {course.instructor.lastName}</span>
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
                      disabled={lesson.isLocked && !lesson.isPublic}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        lesson.isLocked && !lesson.isPublic
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
                          {lesson.isLocked && !lesson.isPublic ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : lesson.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Play className={`w-4 h-4 ${currentLesson?.id === lesson.id ? 'text-primary-600' : 'text-gray-600'}`} />
                          )}
                          <div>
                            <p className={`text-sm font-medium ${
                              lesson.isLocked && !lesson.isPublic ? 'text-gray-500' : currentLesson?.id === lesson.id ? 'text-primary-800' : 'text-gray-900'
                            }`}>
                              {index + 1}. {lesson.title}
                            </p>
                            <div className="flex items-center space-x-2">
                            <p className="text-xs text-gray-500">{lesson.duration} min</p>
                              {lesson.isPublic && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Public
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    {lesson.isLocked && !lesson.isPublic && (
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
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={`${course.thumbnail ? 'hidden' : ''} text-center`}>
                  <div className="text-4xl mb-2">📚</div>
                </div>
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