'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  FileText,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  Home,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description: string
  courseId: string
  courseName: string
  instructorId: string
  instructorName: string
  type: 'quiz' | 'assignment' | 'exam'
  status: 'draft' | 'published' | 'archived'
  totalQuestions: number
  timeLimit: number // in minutes
  passingScore: number
  totalAttempts: number
  averageScore: number
  createdAt: string
  updatedAt: string
  dueDate?: string
  isActive: boolean
}

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      // For now, using mock data since we haven't created the quiz API yet
      setQuizzes([
        {
          id: '1',
          title: 'Dental Anatomy Fundamentals',
          description: 'Comprehensive quiz covering basic dental anatomy and terminology',
          courseId: '1',
          courseName: 'Introduction to Dental Science',
          instructorId: '1',
          instructorName: 'Dr. Sarah Johnson',
          type: 'quiz',
          status: 'published',
          totalQuestions: 25,
          timeLimit: 30,
          passingScore: 70,
          totalAttempts: 156,
          averageScore: 78.5,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
          dueDate: '2024-02-15T23:59:00Z',
          isActive: true
        },
        {
          id: '2',
          title: 'Patient Communication Assignment',
          description: 'Written assignment on effective patient communication techniques',
          courseId: '2',
          courseName: 'Patient Care and Communication',
          instructorId: '2',
          instructorName: 'Dr. Michael Chen',
          type: 'assignment',
          status: 'published',
          totalQuestions: 1,
          timeLimit: 0,
          passingScore: 80,
          totalAttempts: 89,
          averageScore: 85.2,
          createdAt: '2024-01-18T09:00:00Z',
          updatedAt: '2024-01-19T16:45:00Z',
          dueDate: '2024-02-20T23:59:00Z',
          isActive: true
        },
        {
          id: '3',
          title: 'Midterm Examination',
          description: 'Comprehensive midterm exam covering all course material',
          courseId: '3',
          courseName: 'Advanced Restorative Dentistry',
          instructorId: '3',
          instructorName: 'Dr. Emily Rodriguez',
          type: 'exam',
          status: 'draft',
          totalQuestions: 50,
          timeLimit: 120,
          passingScore: 75,
          totalAttempts: 0,
          averageScore: 0,
          createdAt: '2024-01-20T11:30:00Z',
          updatedAt: '2024-01-20T11:30:00Z',
          dueDate: '2024-03-01T23:59:00Z',
          isActive: false
        }
      ])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const types = ['All Types', 'quiz', 'assignment', 'exam']
  const statuses = ['All Status', 'draft', 'published', 'archived']

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'All Types' || quiz.type === selectedType
    const matchesStatus = selectedStatus === 'All Status' || quiz.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        // API call would go here
        setQuizzes(quizzes.filter(quiz => quiz.id !== id))
      } catch (error) {
        console.error('Error deleting quiz:', error)
        alert('Error deleting quiz')
      }
    }
  }

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      // API call would go here
      setQuizzes(quizzes.map(quiz => 
        quiz.id === id ? { ...quiz, isActive: !currentStatus } : quiz
      ))
    } catch (error) {
      console.error('Error updating quiz status:', error)
      alert('Error updating quiz status')
    }
  }

  const getTypeBadge = (type: string) => {
    const typeColors = {
      'quiz': 'bg-blue-100 text-blue-800',
      'assignment': 'bg-green-100 text-green-800',
      'exam': 'bg-purple-100 text-purple-800'
    }
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'published': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'archived': 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quiz & Assignment Management</h1>
                <p className="text-gray-600 mt-2">Create and manage quizzes, assignments, and exams</p>
              </div>
            </div>
            <Link
              href="/admin/quizzes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Quiz
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedType('All Types')
                  setSelectedStatus('All Status')
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.filter(q => q.status === 'published').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{quizzes.reduce((sum, q) => sum + q.totalAttempts, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quizzes.filter(q => q.averageScore > 0).length > 0 
                    ? (quizzes.filter(q => q.averageScore > 0).reduce((sum, q) => sum + q.averageScore, 0) / quizzes.filter(q => q.averageScore > 0).length).toFixed(1)
                    : '0.0'}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Quizzes & Assignments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz/Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course & Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">{quiz.description.substring(0, 60)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.courseName}</div>
                      <div className="text-sm text-gray-500">by {quiz.instructorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="mb-1">{getTypeBadge(quiz.type)}</div>
                      <div>{getStatusBadge(quiz.status)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.totalQuestions} questions</div>
                      {quiz.timeLimit > 0 && (
                        <div className="text-sm text-gray-500">{quiz.timeLimit} min limit</div>
                      )}
                      <div className="text-sm text-gray-500">{quiz.passingScore}% to pass</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.totalAttempts} attempts</div>
                      <div className="text-sm text-gray-500">{quiz.averageScore.toFixed(1)}% avg score</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quiz.dueDate ? (
                        <div>
                          <div>{new Date(quiz.dueDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(quiz.dueDate).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No due date</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/quizzes/${quiz.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/quizzes/${quiz.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleActiveStatus(quiz.id, quiz.isActive)}
                          className={quiz.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        >
                          {quiz.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 