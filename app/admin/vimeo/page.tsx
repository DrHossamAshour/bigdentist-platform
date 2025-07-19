'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Play, 
  Clock, 
  Eye, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Grid,
  List,
  ExternalLink,
  Copy,
  Settings,
  Home,
  Video,
  BarChart3,
  Download,
  Cloud
} from 'lucide-react'
import toast from 'react-hot-toast'

interface VimeoVideo {
  id: string
  title: string
  description: string
  duration: number
  durationFormatted: string
  thumbnail: string
  embedUrl: string
  privacy: string
  stats: {
    plays: number
    likes: number
  }
  createdTime: string | null
  modifiedTime: string | null
  usage: {
    type: string
    items: Array<{
      id: string
      title: string
      instructor: string
    }>
  }
  error?: string
}

interface VimeoSummary {
  totalVideos: number
  totalDuration: number
  totalPlays: number
  totalLikes: number
}

export default function VimeoManagement() {
  const [videos, setVideos] = useState<VimeoVideo[]>([])
  const [summary, setSummary] = useState<VimeoSummary>({
    totalVideos: 0,
    totalDuration: 0,
    totalPlays: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSource, setFilterSource] = useState('all') // 'all', 'courses', 'vimeo_account'

  useEffect(() => {
    fetchVimeoVideos()
  }, [])

  const fetchVimeoVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/vimeo/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
        setSummary(data.summary)
      } else {
        toast.error('Failed to fetch Vimeo videos')
      }
    } catch (error) {
      console.error('Error fetching Vimeo videos:', error)
      toast.error('Error fetching Vimeo videos')
    } finally {
      setLoading(false)
    }
  }

  const syncFromVimeo = async () => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/vimeo/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Merge synced videos with existing course-linked videos
        const existingVideoIds = new Set(videos.map(v => v.id))
        const newVideos = data.videos.filter((v: VimeoVideo) => !existingVideoIds.has(v.id))
        
        setVideos(prev => [...prev, ...newVideos])
        setSummary(data.summary)
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to sync from Vimeo')
      }
    } catch (error) {
      console.error('Error syncing from Vimeo:', error)
      toast.error('Error syncing from Vimeo')
    } finally {
      setSyncing(false)
    }
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.usage.items.some(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'valid' && !video.error) ||
      (filterStatus === 'error' && video.error) ||
      (filterStatus === 'private' && video.privacy === 'nobody')
    
    const matchesSource = 
      filterSource === 'all' ||
      (filterSource === 'courses' && video.usage.type === 'course') ||
      (filterSource === 'vimeo_account' && video.usage.type === 'vimeo_account')
    
    return matchesSearch && matchesFilter && matchesSource
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusIcon = (video: VimeoVideo) => {
    if (video.error) {
      return <XCircle className="w-5 h-5 text-red-500" />
    }
    if (video.privacy === 'nobody') {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }

  const getStatusText = (video: VimeoVideo) => {
    if (video.error) {
      return 'Error'
    }
    if (video.privacy === 'nobody') {
      return 'Private'
    }
    return 'Valid'
  }

  const getSourceBadge = (video: VimeoVideo) => {
    if (video.usage.type === 'vimeo_account') {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Vimeo Account</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Course Linked</span>
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Vimeo videos...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Vimeo Video Management</h1>
                <p className="text-gray-600 mt-2">Manage all external Vimeo videos used in courses</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={syncFromVimeo}
                disabled={syncing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {syncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                {syncing ? 'Syncing...' : 'Sync from Vimeo'}
              </button>
              <button
                onClick={fetchVimeoVideos}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Video className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalVideos}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(summary.totalDuration)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Plays</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalPlays.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search videos, courses, or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="valid">Valid Videos</option>
                  <option value="error">Error Videos</option>
                  <option value="private">Private Videos</option>
                </select>
              </div>
              <div>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="courses">Course Linked</option>
                  <option value="vimeo_account">Vimeo Account</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Videos */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600 mb-4">No Vimeo videos match your search criteria.</p>
            <button
              onClick={syncFromVimeo}
              disabled={syncing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              {syncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              {syncing ? 'Syncing...' : 'Sync from Vimeo'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-video.jpg'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusIcon(video)}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.durationFormatted}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                    {getSourceBadge(video)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.stats.plays.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {video.stats.likes.toLocaleString()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.error ? 'bg-red-100 text-red-800' :
                      video.privacy === 'nobody' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getStatusText(video)}
                    </span>
                  </div>

                  {video.usage.items.length > 0 && (
                    <div className="space-y-2 mb-3">
                      <p className="text-xs text-gray-500 font-medium">Used in:</p>
                      {video.usage.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-xs text-gray-600">
                          • {item.title} (by {item.instructor})
                        </div>
                      ))}
                      {video.usage.items.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{video.usage.items.length - 2} more courses
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => copyToClipboard(video.embedUrl)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                    <a
                      href={`https://vimeo.com/${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-video.jpg'
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{video.title}</div>
                            <div className="text-sm text-gray-500">{video.durationFormatted}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSourceBadge(video)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(video)}
                          <span className="ml-2 text-sm text-gray-900">{getStatusText(video)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {video.stats.plays.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {video.stats.likes.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {video.usage.items.length} course{video.usage.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {video.usage.items.slice(0, 2).map(item => item.title).join(', ')}
                          {video.usage.items.length > 2 && ` +${video.usage.items.length - 2} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(video.embedUrl)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://vimeo.com/${video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 