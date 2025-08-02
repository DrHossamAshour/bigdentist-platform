import { NextRequest, NextResponse } from 'next/server'
import { vimeoAPI } from '@/lib/vimeo'

export async function POST(request: NextRequest) {
  try {
    // Better error handling for request body
    let body;
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    const { videoUrl, domain, protected: isProtected = true } = body
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // Use the improved Vimeo API to extract video ID
    const videoId = vimeoAPI.extractVideoId(videoUrl)

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid Vimeo URL format' }, { status: 400 })
    }

    // Get Vimeo access token from environment
    const vimeoToken = process.env.VIMEO_ACCESS_TOKEN || 'be9a99823ebe2f7b7212d33ce3594e74'
    
    // Debug logging
    console.log('=== VIMEO API DEBUG ===')
    console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('VIMEO')))
    console.log('VIMEO_ACCESS_TOKEN exists:', !!process.env.VIMEO_ACCESS_TOKEN)
    console.log('VIMEO_ACCESS_TOKEN value:', process.env.VIMEO_ACCESS_TOKEN ? `${process.env.VIMEO_ACCESS_TOKEN.substring(0, 10)}...` : 'NOT SET')
    console.log('Using token:', vimeoToken ? `${vimeoToken.substring(0, 10)}...` : 'NOT SET')
    console.log('Video ID:', videoId)
    console.log('Original Video URL:', videoUrl)
    console.log('Normalized URL:', vimeoAPI.normalizeVimeoUrl(videoUrl))
    console.log('Protected Mode:', isProtected)
    console.log('Domain Restriction:', domain)
    console.log('========================')

    if (!vimeoToken) {
      console.warn('VIMEO_ACCESS_TOKEN not configured, using protected embed')
      
      // Use protected embed URL generation for course content
      const embedUrl = vimeoAPI.getEmbedUrl(videoId, {
        autoplay: false,
        muted: false,
        controls: true,
        responsive: true,
        protected: isProtected,
        domain: domain
      })
      
      return NextResponse.json({ 
        embedUrl,
        videoId,
        protected: isProtected,
        message: 'Using protected embed (Vimeo token not configured)'
      })
    }

    try {
      // Fetch video details from Vimeo API
      const vimeoResponse = await fetch(`https://api.vimeo.com/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${vimeoToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!vimeoResponse.ok) {
        console.warn(`Vimeo API error: ${vimeoResponse.status}`)
        // Fallback to protected embed URL
        const embedUrl = vimeoAPI.getEmbedUrl(videoId, {
          autoplay: false,
          muted: false,
          controls: true,
          responsive: true,
          protected: isProtected,
          domain: domain
        })
        
        return NextResponse.json({ 
          embedUrl,
          videoId,
          protected: isProtected,
          message: 'Using protected embed (Vimeo API error)'
        })
      }

      const videoData = await vimeoResponse.json()
      
      // Check video privacy settings
      const privacy = videoData.privacy?.view || 'anybody'
      const embedPrivacy = videoData.privacy?.embed || 'public'
      
      console.log(`Video privacy: ${privacy}, embed privacy: ${embedPrivacy}`)

      // Use protected embed URL generation with privacy considerations
      let embedUrl = vimeoAPI.getEmbedUrl(videoId, {
        autoplay: false,
        muted: false,
        controls: true,
        responsive: true,
        protected: isProtected,
        domain: domain
      })

      // For unlisted videos, we need to add the hash parameter
      if (privacy === 'unlisted' && videoData.link) {
        const hashMatch = videoData.link.match(/\/b([a-f0-9]+)/)
        if (hashMatch) {
          embedUrl += `&h=${hashMatch[1]}`
        }
      }

      return NextResponse.json({
        embedUrl,
        videoId,
        title: videoData.name,
        duration: videoData.duration,
        privacy,
        protected: isProtected,
        message: 'Protected video embed URL generated successfully'
      })

    } catch (apiError) {
      console.error('Error fetching from Vimeo API:', apiError)
      
      // Fallback to protected embed URL
      const embedUrl = vimeoAPI.getEmbedUrl(videoId, {
        autoplay: false,
        muted: false,
        controls: true,
        responsive: true,
        protected: isProtected,
        domain: domain
      })
      
      return NextResponse.json({ 
        embedUrl,
        videoId,
        protected: isProtected,
        message: 'Using protected embed (API error)'
      })
    }

  } catch (error) {
    console.error('Error processing Vimeo embed request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 