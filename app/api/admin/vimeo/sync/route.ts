import { NextRequest, NextResponse } from 'next/server'
import { vimeoAPI } from '@/lib/vimeo'

export async function POST(request: NextRequest) {
  try {
    // Check if Vimeo access token is configured
    if (!process.env.VIMEO_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Vimeo access token not configured. Please add VIMEO_ACCESS_TOKEN to your environment variables.' },
        { status: 400 }
      )
    }

    // Fetch all videos from Vimeo account
    const response = await fetch('https://api.vimeo.com/me/videos?per_page=100&fields=uri,name,description,duration,pictures,stats,privacy,created_time,modified_time', {
      headers: {
        'Authorization': `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Vimeo API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch videos from Vimeo: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const videos = data.data || []

    // Transform Vimeo API response to our format
    const transformedVideos = videos.map((video: any) => {
      const videoId = video.uri.split('/').pop() // Extract ID from "uri": "/videos/123456789"
      
      return {
        id: videoId,
        title: video.name || 'Untitled Video',
        description: video.description || '',
        duration: video.duration || 0,
        durationFormatted: vimeoAPI.formatDuration(video.duration || 0),
        thumbnail: video.pictures?.base_link ? `${video.pictures.base_link}_1280x720.jpg` : vimeoAPI.getThumbnailUrl(videoId, 'medium'),
        embedUrl: vimeoAPI.getEmbedUrl(videoId),
        privacy: video.privacy?.view || 'unknown',
        stats: {
          plays: video.stats?.plays || 0,
          likes: video.stats?.likes || 0
        },
        createdTime: video.created_time,
        modifiedTime: video.modified_time,
        // Check if this video is used in any courses
        usage: {
          type: 'vimeo_account',
          items: [] // Will be populated if video is used in courses
        }
      }
    })

    // Sort by most recently modified
    transformedVideos.sort((a: any, b: any) => {
      if (!a.modifiedTime) return 1
      if (!b.modifiedTime) return -1
      return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
    })

    // Calculate summary statistics
    const summary = {
      totalVideos: transformedVideos.length,
      totalDuration: transformedVideos.reduce((sum: number, v: any) => sum + v.duration, 0),
      totalPlays: transformedVideos.reduce((sum: number, v: any) => sum + v.stats.plays, 0),
      totalLikes: transformedVideos.reduce((sum: number, v: any) => sum + v.stats.likes, 0)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${transformedVideos.length} videos from Vimeo`,
      videos: transformedVideos,
      summary,
      pagination: data.paging || null
    })

  } catch (error) {
    console.error('Error syncing Vimeo videos:', error)
    return NextResponse.json(
      { error: 'Failed to sync videos from Vimeo. Please check your API token and try again.' },
      { status: 500 }
    )
  }
} 