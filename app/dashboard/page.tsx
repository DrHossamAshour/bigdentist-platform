'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface EnrolledCourse {
  id: string
  title: string
  instructor: string
  thumbnail: string
  progress: number
  totalLessons: number
  completedLessons: number
  lastAccessed: string
  rating: number
  category: string
}

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalHours: number
  averageRating: number
  streak: number
}

export default function Dashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    averageRating: 0,
    streak: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check user role from localStorage first, then JWT token
    if (typeof window !== 'undefined') {
      // Check localStorage first (more reliable)
      const userData = localStorage.getItem('userData')
      if (userData) {
        try {
          const parsed = JSON.parse(userData)
          if (parsed.role === 'ADMIN' || parsed.role === 'SUPER_ADMIN') {
            console.log('Admin detected in localStorage, redirecting to /admin')
            router.replace('/admin')
            return
          }
        } catch (e) {
          console.error('Error parsing userData:', e)
        }
      }
      
      // Fallback to JWT token from cookies
      const match = document.cookie.match(/auth-token=([^;]+)/)
      if (match) {
        try {
          const token = match[1]
          const decoded = jwtDecode(token) as { role?: string }
          if (decoded.role === 'ADMIN' || decoded.role === 'SUPER_ADMIN') {
            console.log('Admin detected in JWT, redirecting to /admin')
            router.replace('/admin')
            return
          }
        } catch (e) {
          console.error('Error decoding JWT:', e)
        }
      }
    }
    // Mock data - in real app, fetch from API
    setEnrolledCourses([
      {
        id: '1',
        title: 'Complete React Developer Course',
        instructor: 'John Doe',
        thumbnail: '🎨',
        progress: 75,
        totalLessons: 24,
        completedLessons: 18,
        lastAccessed: '2024-01-15',
        rating: 4.8,
        category: 'Programming'
      },
      {
        id: '2',
        title: 'Advanced JavaScript Concepts',
        instructor: 'Jane Smith',
        thumbnail: '💻',
        progress: 45,
        totalLessons: 18,
        completedLessons: 8,
        lastAccessed: '2024-01-14',
        rating: 4.9,
        category: 'Programming'
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        instructor: 'Mike Johnson',
        thumbnail: '🎨',
        progress: 90,
        totalLessons: 12,
        completedLessons: 11,
        lastAccessed: '2024-01-13',
        rating: 4.7,
        category: 'Design'
      }
    ])

    setStats({
      totalCourses: 8,
      completedCourses: 3,
      totalHours: 45,
      averageRating: 4.8,
      streak: 7,
    })

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Continue your learning journey.</p>
            </div>
            <Link 
              href="/courses"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Day Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
            <p className="text-gray-600 mt-1">Pick up where you left off</p>
          </div>
          <div className="p-6">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by enrolling in your first course.</p>
                <div className="mt-6">
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <div className="text-4xl">{course.thumbnail}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {course.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>Last accessed {new Date(course.lastAccessed).toLocaleDateString()}</span>
                      </div>
                      
                      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Completed lesson 5 in React Course</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Started JavaScript Advanced Course</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Earned "Quick Learner" badge</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">Quick Learner</h3>
                  <p className="text-xs text-gray-500">Complete 5 lessons in a day</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">Goal Setter</h3>
                  <p className="text-xs text-gray-500">Set your first learning goal</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Streak Master</h3>
                  <p className="text-xs text-gray-400">Learn for 30 days straight</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg opacity-50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Early Bird</h3>
                  <p className="text-xs text-gray-400">Complete a lesson before 8 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 