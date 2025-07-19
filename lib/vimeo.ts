interface VimeoVideo {
  id: string
  title: string
  description: string
  duration: number
  thumbnail: string
  embed_url: string
  privacy: {
    view: string
  }
  stats: {
    plays: number
    likes: number
  }
  created_time: string
  modified_time: string
}

interface VimeoError {
  error: string
  message: string
}

class VimeoAPI {
  private accessToken: string

  constructor() {
    this.accessToken = process.env.VIMEO_ACCESS_TOKEN || ''
  }

  // Extract video ID from Vimeo URL
  extractVideoId(url: string): string | null {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /vimeo\.com\/video\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  // Validate if a URL is a valid Vimeo link
  isValidVimeoUrl(url: string): boolean {
    return this.extractVideoId(url) !== null
  }

  // Fetch video metadata from Vimeo API
  async getVideoInfo(videoId: string): Promise<VimeoVideo | null> {
    if (!this.accessToken) {
      console.warn('Vimeo access token not configured')
      return null
    }

    try {
      const response = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Video not found or is private')
        }
        throw new Error(`Vimeo API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching Vimeo video info:', error)
      return null
    }
  }

  // Validate a Vimeo URL and return video info
  async validateVideoUrl(url: string): Promise<{
    isValid: boolean
    video?: VimeoVideo
    error?: string
  }> {
    if (!this.isValidVimeoUrl(url)) {
      return {
        isValid: false,
        error: 'Invalid Vimeo URL format'
      }
    }

    const videoId = this.extractVideoId(url)
    if (!videoId) {
      return {
        isValid: false,
        error: 'Could not extract video ID from URL'
      }
    }

    const video = await this.getVideoInfo(videoId)
    if (!video) {
      return {
        isValid: false,
        error: 'Video not found or is private'
      }
    }

    if (video.privacy.view === 'nobody') {
      return {
        isValid: false,
        error: 'Video is private and cannot be embedded'
      }
    }

    return {
      isValid: true,
      video
    }
  }

  // Get embed URL for a video
  getEmbedUrl(videoId: string, options: {
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    responsive?: boolean
  } = {}): string {
    const params = new URLSearchParams()
    
    if (options.autoplay) params.append('autoplay', '1')
    if (options.muted) params.append('muted', '1')
    if (options.controls !== false) params.append('controls', '1')
    if (options.responsive !== false) params.append('responsive', '1')

    const queryString = params.toString()
    return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ''}`
  }

  // Format duration from seconds to MM:SS or HH:MM:SS
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Get thumbnail URL with specific size
  getThumbnailUrl(videoId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: '640x360',
      medium: '1280x720',
      large: '1920x1080'
    }
    return `https://vumbnail.com/${videoId}_${sizes[size]}.jpg`
  }
}

export const vimeoAPI = new VimeoAPI()
export type { VimeoVideo, VimeoError } 