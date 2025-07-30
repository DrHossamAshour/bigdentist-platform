import { NextRequest, NextResponse } from 'next/server'

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
    
    const { videoUrl } = body
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    // Extract video ID from various Vimeo URL formats
    const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1] || 
                   videoUrl.match(/vimeo\.com\/video\/(\d+)/)?.[1] ||
                   videoUrl.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1]

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
    console.log('Video URL received:', videoUrl)
    console.log('========================')

    if (!vimeoToken) {
      console.warn('VIMEO_ACCESS_TOKEN not configured, using basic embed')
      
      // Extract hash from original URL if available
      const hashMatch = videoUrl.match(/\/b([a-f0-9]+)/)
      const hashParam = hashMatch ? `&h=${hashMatch[1]}` : ''
      
      // Fallback to basic embed URL
      const embedUrl = `https://player.vimeo.com/video/${videoId}?h=auto&autoplay=0&title=0&byline=0&portrait=0&dnt=1&transparent=0${hashParam}`
      return NextResponse.json({ 
        embedUrl,
        videoId,
        message: 'Using basic embed (Vimeo token not configured)'
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
        // Fallback to basic embed URL
        const embedUrl = `https://player.vimeo.com/video/${videoId}?h=auto&autoplay=0&title=0&byline=0&portrait=0&dnt=1&transparent=0`
        return NextResponse.json({ 
          embedUrl,
          videoId,
          message: 'Using basic embed (Vimeo API error)'
        })
      }

      const videoData = await vimeoResponse.json()
      
      // Check video privacy settings
      const privacy = videoData.privacy?.view || 'anybody'
      const embedPrivacy = videoData.privacy?.embed || 'public'
      
      console.log(`Video privacy: ${privacy}, embed privacy: ${embedPrivacy}`)

      // Build embed URL with appropriate parameters
      let embedUrl = `https://player.vimeo.com/video/${videoId}`
      
      // Add parameters for better compatibility
      const params = new URLSearchParams({
        h: 'auto',
        autoplay: '0',
        title: '0',
        byline: '0',
        portrait: '0',
        dnt: '1',
        transparent: '0'
      })

      // For unlisted videos, we need to add the hash parameter
      if (privacy === 'unlisted' || privacy === 'nobody') {
        // Extract hash from original URL if available
        const hashMatch = videoUrl.match(/\/b([a-f0-9]+)/)
        if (hashMatch) {
          params.set('h', `b${hashMatch[1]}`)
        }
      }

      // Add domain restriction if video is domain-restricted
      if (embedPrivacy === 'whitelist') {
        params.append('domain', 'localhost')
        params.append('domain', 'yourdomain.com') // Add your actual domain
      }

      embedUrl += `?${params.toString()}`

      console.log('Final embed URL:', embedUrl)

      return NextResponse.json({
        embedUrl,
        videoId,
        videoTitle: videoData.name,
        duration: videoData.duration,
        privacy,
        embedPrivacy,
        thumbnail: videoData.pictures?.base_link,
        message: 'Video details fetched successfully'
      })

    } catch (apiError) {
      console.error('Vimeo API error:', apiError)
      // Fallback to basic embed URL
      const embedUrl = `https://player.vimeo.com/video/${videoId}?h=auto&autoplay=0&title=0&byline=0&portrait=0&dnt=1&transparent=0`
      return NextResponse.json({ 
        embedUrl,
        videoId,
        message: 'Using basic embed (API error)'
      })
    }

  } catch (error) {
    console.error('Vimeo embed error:', error)
    return NextResponse.json({ error: 'Failed to process video URL' }, { status: 500 })
  }
} 