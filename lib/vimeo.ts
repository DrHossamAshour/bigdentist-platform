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
    // First, decode HTML entities and normalize the URL
    const normalizedUrl = this.normalizeVimeoUrl(url)
    
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /vimeo\.com\/video\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
      /vimeo\.com\/(\d+)\/[a-zA-Z0-9]+/, // Format: vimeo.com/ID/hash
      /player\.vimeo\.com\/video\/(\d+)\?.*/ // Format: player.vimeo.com/video/ID?params
    ]

    for (const pattern of patterns) {
      const match = normalizedUrl.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  // Normalize Vimeo URL by decoding HTML entities and cleaning up
  normalizeVimeoUrl(url: string): string {
    // Decode HTML entities
    let normalized = url
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
    
    // Remove any trailing parameters that might interfere
    // Keep only the essential parts for video ID extraction
    if (normalized.includes('player.vimeo.com/video/')) {
      // For player URLs, keep only up to the video ID
      const match = normalized.match(/(player\.vimeo\.com\/video\/\d+)/)
      if (match) {
        normalized = match[1]
      }
    }
    
    return normalized
  }

  // Convert any Vimeo URL to a standard embed URL
  convertToEmbedUrl(url: string): string | null {
    const videoId = this.extractVideoId(url)
    if (!videoId) {
      return null
    }
    
    return this.getEmbedUrl(videoId, {
      autoplay: false,
      muted: false,
      controls: true,
      responsive: true
    })
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

  // Get embed URL for a video with protection settings
  getEmbedUrl(videoId: string, options: {
    autoplay?: boolean
    muted?: boolean
    controls?: boolean
    responsive?: boolean
    protected?: boolean // New option for protected content
    domain?: string // Domain restriction
  } = {}): string {
    const params = new URLSearchParams()
    
    // Basic player settings
    if (options.autoplay) params.append('autoplay', '1')
    if (options.muted) params.append('muted', '1')
    if (options.controls !== false) params.append('controls', '1')
    if (options.responsive !== false) params.append('responsive', '1')

    // Protection settings for course content
    if (options.protected !== false) {
      // Remove Vimeo branding
      params.append('badge', '0')
      params.append('title', '0')
      params.append('byline', '0')
      params.append('portrait', '0')
      
      // Disable sharing and social features
      params.append('dnt', '1') // Do Not Track
      params.append('transparent', '0')
      
      // Disable autopause (prevents interference)
      params.append('autopause', '0')
      
      // Disable downloads and right-click
      params.append('download', '0') // Disable download button
      params.append('pip', '0') // Disable picture-in-picture
      params.append('fullscreen', '0') // Disable fullscreen (optional)
      
      // Add domain restriction if specified
      if (options.domain) {
        params.append('domain', options.domain)
      } else {
        // Default domain restrictions for common deployment domains
        params.append('domain', 'localhost')
        params.append('domain', 'bigdentist-platform.vercel.app')
        params.append('domain', 'vercel.app')
        params.append('domain', 'netlify.app')
      }
    }

    const queryString = params.toString()
    return `https://player.vimeo.com/video/${videoId}${queryString ? `?${queryString}` : ''}`
  }

  // Convert any Vimeo URL to a protected embed URL for course content
  convertToProtectedEmbedUrl(url: string, domain?: string): string | null {
    const videoId = this.extractVideoId(url)
    if (!videoId) {
      return null
    }
    
    return this.getEmbedUrl(videoId, {
      autoplay: false,
      muted: false,
      controls: true,
      responsive: true,
      protected: true, // Enable protection
      domain: domain
    })
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