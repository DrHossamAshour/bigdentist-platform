import { NextRequest, NextResponse } from 'next/server'
import { vimeoAPI } from '@/lib/vimeo'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    const validation = await vimeoAPI.validateVideoUrl(url)

    if (!validation.isValid) {
      return NextResponse.json({
        isValid: false,
        error: validation.error
      }, { status: 400 })
    }

    const video = validation.video!
    const videoId = vimeoAPI.extractVideoId(url)!

    return NextResponse.json({
      isValid: true,
      video: {
        id: videoId,
        title: video.title,
        description: video.description,
        duration: video.duration,
        durationFormatted: vimeoAPI.formatDuration(video.duration),
        thumbnail: vimeoAPI.getThumbnailUrl(videoId, 'medium'),
        embedUrl: vimeoAPI.getEmbedUrl(videoId),
        privacy: video.privacy.view,
        stats: {
          plays: video.stats.plays,
          likes: video.stats.likes
        },
        createdTime: video.created_time,
        modifiedTime: video.modified_time
      }
    })

  } catch (error) {
    console.error('Error validating Vimeo URL:', error)
    return NextResponse.json(
      { error: 'Failed to validate video URL' },
      { status: 500 }
    )
  }
} 