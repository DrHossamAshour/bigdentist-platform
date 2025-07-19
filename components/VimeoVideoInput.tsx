'use client'

import { useState, useEffect } from 'react'
import { Play, AlertTriangle, CheckCircle, Loader2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface VimeoVideoInputProps {
  value: string
  onChange: (url: string) => void
  onValidation?: (isValid: boolean, videoData?: any) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

interface VideoData {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  embedUrl: string
  privacy: string
  stats: {
    plays: number
    likes: number
  }
}

export default function VimeoVideoInput({
  value,
  onChange,
  onValidation,
  placeholder = "Enter Vimeo video URL...",
  label = "Video URL",
  required = false,
  disabled = false
}: VimeoVideoInputProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Validate URL when value changes
  useEffect(() => {
    if (value && value.trim()) {
      validateVideoUrl(value)
    } else {
      setVideoData(null)
      setValidationError(null)
      onValidation?.(false)
    }
  }, [value])

  const validateVideoUrl = async (url: string) => {
    setIsValidating(true)
    setValidationError(null)

    try {
      const response = await fetch('/api/admin/vimeo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (data.isValid && data.video) {
        setVideoData(data.video)
        setValidationError(null)
        onValidation?.(true, data.video)
        toast.success('Video URL is valid!')
      } else {
        setVideoData(null)
        setValidationError(data.error || 'Invalid video URL')
        onValidation?.(false)
        toast.error(data.error || 'Invalid video URL')
      }
    } catch (error) {
      console.error('Error validating video URL:', error)
      setVideoData(null)
      setValidationError('Failed to validate video URL')
      onValidation?.(false)
      toast.error('Failed to validate video URL')
    } finally {
      setIsValidating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    onChange(newUrl)
  }

  const handleManualValidation = () => {
    if (value && value.trim()) {
      validateVideoUrl(value)
    }
  }

  const copyEmbedUrl = () => {
    if (videoData?.embedUrl) {
      navigator.clipboard.writeText(videoData.embedUrl)
      toast.success('Embed URL copied to clipboard!')
    }
  }

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationError ? 'border-red-300' : 
              videoData ? 'border-green-300' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isValidating ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : validationError ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : videoData ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        </div>
        
        {/* Manual validation button */}
        {value && !isValidating && !videoData && (
          <button
            type="button"
            onClick={handleManualValidation}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Validate Video URL
          </button>
        )}

        {/* Error message */}
        {validationError && (
          <p className="mt-2 text-sm text-red-600">{validationError}</p>
        )}
      </div>

      {/* Video Preview */}
      {videoData && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-medium text-gray-900">Video Preview</h4>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={videoData.thumbnail}
                alt={videoData.title}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-video.jpg'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-2">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="md:col-span-2 space-y-2">
              <h5 className="font-medium text-gray-900 line-clamp-2">{videoData.title}</h5>
              <p className="text-sm text-gray-600 line-clamp-2">{videoData.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Play className="w-4 h-4 mr-1" />
                  {videoData.duration}
                </span>
                <span className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {videoData.stats.plays.toLocaleString()} plays
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  videoData.privacy === 'nobody' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {videoData.privacy === 'nobody' ? 'Private' : 'Public'}
                </span>
                <button
                  type="button"
                  onClick={copyEmbedUrl}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Copy Embed URL
                </button>
              </div>
            </div>
          </div>

          {/* Video Player Preview */}
          {showPreview && (
            <div className="mt-4">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
                <iframe
                  src={videoData.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 