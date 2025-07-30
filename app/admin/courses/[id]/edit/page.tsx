'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save, Loader2, ArrowLeft, BookOpen, Play, FileText, Plus, Edit, Trash2, Eye, X } from 'lucide-react'
import Link from 'next/link'

const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Mobile Development', 'Cloud Computing']
const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

interface Course {
  id: string
  title: string
  description: string
  content: string
  price: number
  originalPrice?: number
  category: string
  level: string
  thumbnail?: string
  videoUrl?: string
  duration: number
  isPublished: boolean
  isFeatured: boolean
  instructor: {
    firstName: string
    lastName: string
  }
}

interface Topic {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  topicId: string
  isPublic?: boolean
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: number
  timeLimit: number
  passingScore: number
  topicId: string
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  
  const [activeTab, setActiveTab] = useState('details')
  const [course, setCourse] = useState<Course | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    price: '',
    originalPrice: '',
    category: '',
    level: '',
    thumbnail: '',
    videoUrl: '',
    duration: '',
    isPublished: false,
    isFeatured: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Modal states
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')

  // Form states for modals
  const [topicForm, setTopicForm] = useState({
    title: '',
    description: ''
  })
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    topicId: '',
    isPublic: false
  })

  useEffect(() => {
    fetchCourse()
    fetchCourseContent()
    
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['details', 'topics', 'quizzes'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (response.ok) {
        const courseData = await response.json()
        setCourse(courseData)
        setForm({
          title: courseData.title,
          description: courseData.description,
          content: courseData.content || '',
          price: courseData.price.toString(),
          originalPrice: courseData.originalPrice?.toString() || '',
          category: courseData.category,
          level: courseData.level,
          thumbnail: courseData.thumbnail || '',
          videoUrl: courseData.videoUrl || '',
          duration: courseData.duration.toString(),
          isPublished: courseData.isPublished,
          isFeatured: courseData.isFeatured,
        })
      } else {
        setError('Course not found')
      }
    } catch (err) {
      setError('Error loading course')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseContent = async () => {
    try {
      // Fetch topics, lessons, and quizzes
      const [topicsRes, lessonsRes, quizzesRes] = await Promise.all([
        fetch(`/api/courses/${courseId}/topics`),
        fetch(`/api/courses/${courseId}/lessons`),
        fetch(`/api/courses/${courseId}/quizzes`)
      ])
      
      if (topicsRes.ok) {
        const topicsData = await topicsRes.json()
        setTopics(topicsData)
      }
      
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json()
        setLessons(lessonsData)
      }
      
      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json()
        setQuizzes(quizzesData)
      }
    } catch (err) {
      console.error('Error fetching course content:', err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm({ ...form, [name]: checked })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        duration: parseInt(form.duration) || 0,
      }
      
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error updating course')
        setSaving(false)
        return
      }
      
      router.push('/admin/courses')
    } catch (err) {
      setError('Error updating course')
      setSaving(false)
    }
  }

  // Topic management functions
  const openTopicModal = (topic?: Topic) => {
    if (topic) {
      setEditingTopic(topic)
      setTopicForm({
        title: topic.title,
        description: topic.description
      })
    } else {
      setEditingTopic(null)
      setTopicForm({ title: '', description: '' })
    }
    setShowTopicModal(true)
  }

  const closeTopicModal = () => {
    setShowTopicModal(false)
    setEditingTopic(null)
    setTopicForm({ title: '', description: '' })
  }

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTopic 
        ? `/api/courses/${courseId}/topics/${editingTopic.id}`
        : `/api/courses/${courseId}/topics`
      
      const method = editingTopic ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicForm)
      })
      
      if (response.ok) {
        await fetchCourseContent()
        closeTopicModal()
      } else {
        alert('Error saving topic')
      }
    } catch (err) {
      console.error('Error saving topic:', err)
      alert('Error saving topic')
    }
  }

  const deleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? This will also delete all lessons in this topic.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/courses/${courseId}/topics/${topicId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchCourseContent()
      } else {
        alert('Error deleting topic')
      }
    } catch (err) {
      console.error('Error deleting topic:', err)
      alert('Error deleting topic')
    }
  }

  // Lesson management functions
  const openLessonModal = (lesson?: Lesson, topicId?: string) => {
    if (lesson) {
      setEditingLesson(lesson)
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration.toString(),
        topicId: lesson.topicId,
        isPublic: lesson.isPublic || false
      })
    } else {
      setEditingLesson(null)
      setLessonForm({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        topicId: topicId || '',
        isPublic: false
      })
    }
    setShowLessonModal(true)
  }

  const closeLessonModal = () => {
    setShowLessonModal(false)
    setEditingLesson(null)
    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      topicId: '',
      isPublic: false
    })
  }

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLesson 
        ? `/api/courses/${courseId}/lessons/${editingLesson.id}`
        : `/api/courses/${courseId}/lessons`
      
      const method = editingLesson ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lessonForm,
          duration: parseInt(lessonForm.duration),
          isPublic: lessonForm.isPublic
        })
      })
      
      if (response.ok) {
        await fetchCourseContent()
        closeLessonModal()
      } else {
        alert('Error saving lesson')
      }
    } catch (err) {
      console.error('Error saving lesson:', err)
      alert('Error saving lesson')
    }
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons?lessonId=${lessonId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchCourseContent()
      } else {
        const errorData = await response.json()
        alert(`Error deleting lesson: ${errorData.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error deleting lesson:', err)
      alert('Error deleting lesson')
    }
  }

  const tabs = [
    { id: 'details', name: 'Course Details', icon: BookOpen },
    { id: 'topics', name: 'Topics & Lessons', icon: Play },
    { id: 'quizzes', name: 'Quizzes', icon: FileText },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/admin/courses"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/courses" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course: {course?.title}</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'details' && (
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter detailed course content and learning objectives"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Level</option>
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail URL</label>
                    <input
                      type="text"
                      name="thumbnail"
                      value={form.thumbnail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview Video URL</label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (in minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="120"
                  />
                </div>
                
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={form.isPublished}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Link
                    href="/admin/courses"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Topics & Lessons</h2>
                <button 
                  onClick={() => openTopicModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </div>
              
              {topics.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first topic to organize your course content.</p>
                  <button 
                    onClick={() => openTopicModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add First Topic
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {topics.map((topic) => {
                    const topicLessons = lessons.filter(lesson => lesson.topicId === topic.id)
                    return (
                      <div key={topic.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                            <p className="text-gray-600 mt-1">{topic.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openTopicModal(topic)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteTopic(topic.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">
                            {topicLessons.length} lessons
                          </span>
                          <button 
                            onClick={() => openLessonModal(undefined, topic.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Lesson
                          </button>
                        </div>
                        
                        {topicLessons.length > 0 && (
                          <div className="space-y-2">
                            {topicLessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">{lesson.title}</span>
                                  <span className="text-sm text-gray-500">{lesson.duration} min</span>
                                  {lesson.isPublic && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Public
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="text-blue-600 hover:text-blue-700">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => openLessonModal(lesson)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => deleteLesson(lesson.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quizzes & Assessments</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Quiz
                </button>
              </div>
              
              {quizzes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
                  <p className="text-gray-600 mb-4">Add quizzes to test your students' knowledge and track their progress.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Add First Quiz
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Questions:</span>
                          <span className="font-medium">{quiz.questions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time Limit:</span>
                          <span className="font-medium">{quiz.timeLimit} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Passing Score:</span>
                          <span className="font-medium">{quiz.passingScore}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                          View Results
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingTopic ? 'Edit Topic' : 'Add New Topic'}
              </h3>
              <button onClick={closeTopicModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic Title *</label>
                <input
                  type="text"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter topic title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter topic description"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeTopicModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTopic ? 'Update Topic' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <button onClick={closeLessonModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                <input
                  type="url"
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={lessonForm.isPublic}
                    onChange={(e) => setLessonForm({ ...lessonForm, isPublic: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Make this lesson publicly viewable</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeLessonModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 