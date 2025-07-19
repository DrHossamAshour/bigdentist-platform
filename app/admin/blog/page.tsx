'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Rss,
  Calendar,
  User,
  Eye as EyeIcon,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Lock,
  Home
} from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  status: 'draft' | 'published' | 'archived'
  category: string
  tags: string[]
  featuredImage?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
}

export default function AdminBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      // For now, using mock data since we haven't created the blog API yet
      setBlogPosts([
        {
          id: '1',
          title: 'The Future of Dental Education: AI-Powered Learning',
          excerpt: 'Discover how artificial intelligence is revolutionizing dental education and training methods.',
          content: 'Full article content would go here...',
          author: {
            id: '1',
            name: 'Dr. Sarah Johnson',
            avatar: '/avatars/sarah.jpg'
          },
          status: 'published',
          category: 'Technology',
          tags: ['AI', 'Dental Education', 'Innovation'],
          featuredImage: '/blog/ai-dental-education.jpg',
          publishedAt: '2024-01-20T10:00:00Z',
          createdAt: '2024-01-18T15:30:00Z',
          updatedAt: '2024-01-20T09:45:00Z',
          views: 1245,
          likes: 89,
          comments: 23,
          isFeatured: true,
          seoTitle: 'AI-Powered Dental Education - The Future of Learning',
          seoDescription: 'Learn how AI is transforming dental education with personalized learning experiences.'
        },
        {
          id: '2',
          title: 'Essential Dental Hygiene Practices for 2024',
          excerpt: 'A comprehensive guide to maintaining optimal oral health with modern techniques and tools.',
          content: 'Full article content would go here...',
          author: {
            id: '2',
            name: 'Dr. Michael Chen',
            avatar: '/avatars/michael.jpg'
          },
          status: 'published',
          category: 'Health & Wellness',
          tags: ['Dental Hygiene', 'Oral Health', 'Prevention'],
          featuredImage: '/blog/dental-hygiene-2024.jpg',
          publishedAt: '2024-01-19T14:30:00Z',
          createdAt: '2024-01-17T11:20:00Z',
          updatedAt: '2024-01-19T14:30:00Z',
          views: 892,
          likes: 67,
          comments: 15,
          isFeatured: false,
          seoTitle: 'Dental Hygiene Best Practices 2024',
          seoDescription: 'Essential dental hygiene practices for optimal oral health in 2024.'
        },
        {
          id: '3',
          title: 'Advanced Restorative Dentistry Techniques',
          excerpt: 'Exploring the latest innovations in restorative dentistry and their applications.',
          content: 'Full article content would go here...',
          author: {
            id: '3',
            name: 'Dr. Emily Rodriguez',
            avatar: '/avatars/emily.jpg'
          },
          status: 'draft',
          category: 'Clinical Practice',
          tags: ['Restorative Dentistry', 'Innovation', 'Techniques'],
          featuredImage: '/blog/restorative-dentistry.jpg',
          createdAt: '2024-01-20T08:15:00Z',
          updatedAt: '2024-01-20T08:15:00Z',
          views: 0,
          likes: 0,
          comments: 0,
          isFeatured: false
        }
      ])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All Categories', 'Technology', 'Health & Wellness', 'Clinical Practice', 'Education', 'Industry News']
  const statuses = ['All Status', 'draft', 'published', 'archived']

  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = selectedStatus === 'All Status' || post.status === selectedStatus
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        // API call would go here
        setBlogPosts(blogPosts.filter(post => post.id !== id))
      } catch (error) {
        console.error('Error deleting blog post:', error)
        alert('Error deleting blog post')
      }
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      // API call would go here
      setBlogPosts(blogPosts.map(post => 
        post.id === id ? { ...post, isFeatured: !currentStatus } : post
      ))
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
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
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600 mt-2">Create and manage blog content for your platform</p>
              </div>
            </div>
            <Link
              href="/admin/blog/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Post
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
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('All Status')
                  setSelectedCategory('All Categories')
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
              <Rss className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.filter(p => p.status === 'published').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EyeIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ThumbsUp className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{blogPosts.reduce((sum, p) => sum + p.likes, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All Blog Posts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {post.featuredImage ? (
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                              <Rss className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500">{post.excerpt.substring(0, 60)}...</div>
                          <div className="flex items-center space-x-2 mt-1">
                            {post.isFeatured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                            {post.status === 'published' ? (
                              <Globe className="w-3 h-3 text-green-600" />
                            ) : (
                              <Lock className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{post.author.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{post.views} views</div>
                      <div className="text-sm text-gray-500">{post.likes} likes • {post.comments} comments</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.publishedAt ? (
                        <div>
                          <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(post.publishedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not published</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleFeatured(post.id, post.isFeatured)}
                          className={post.isFeatured ? "text-yellow-600 hover:text-yellow-900" : "text-gray-600 hover:text-gray-900"}
                        >
                          {post.isFeatured ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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