import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { vimeoAPI } from '@/lib/vimeo'

export async function GET(request: NextRequest) {
  try {
    // Fetch all courses and lessons that have videoUrl fields
    const courses = await prisma.course.findMany({
      where: {
        videoUrl: {
          not: null
        }
      },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Extract Vimeo URLs and validate them
    const vimeoVideos: any[] = []
    const processedUrls = new Set<string>()

    for (const course of courses) {
      if (course.videoUrl && vimeoAPI.isValidVimeoUrl(course.videoUrl)) {
        const videoId = vimeoAPI.extractVideoId(course.videoUrl)
        
        if (videoId && !processedUrls.has(videoId)) {
          processedUrls.add(videoId)
          
          // Try to get video metadata
          const videoInfo = await vimeoAPI.getVideoInfo(videoId)
          
          if (videoInfo) {
            vimeoVideos.push({
              id: videoId,
              title: videoInfo.title,
              description: videoInfo.description,
              duration: videoInfo.duration,
              durationFormatted: vimeoAPI.formatDuration(videoInfo.duration),
              thumbnail: vimeoAPI.getThumbnailUrl(videoId, 'medium'),
              embedUrl: vimeoAPI.getEmbedUrl(videoId),
              privacy: videoInfo.privacy.view,
              stats: {
                plays: videoInfo.stats.plays,
                likes: videoInfo.stats.likes
              },
              createdTime: videoInfo.created_time,
              modifiedTime: videoInfo.modified_time,
              usage: {
                type: 'course',
                items: courses.filter(c => c.videoUrl === course.videoUrl).map(c => ({
                  id: c.id,
                  title: c.title,
                  instructor: `${c.instructor.firstName} ${c.instructor.lastName}`
                }))
              }
            })
          } else {
            // Video exists but we couldn't fetch metadata (maybe private or API issue)
            vimeoVideos.push({
              id: videoId,
              title: 'Unknown Video',
              description: 'Video metadata unavailable',
              duration: 0,
              durationFormatted: '0:00',
              thumbnail: vimeoAPI.getThumbnailUrl(videoId, 'medium'),
              embedUrl: vimeoAPI.getEmbedUrl(videoId),
              privacy: 'unknown',
              stats: {
                plays: 0,
                likes: 0
              },
              createdTime: null,
              modifiedTime: null,
              usage: {
                type: 'course',
                items: courses.filter(c => c.videoUrl === course.videoUrl).map(c => ({
                  id: c.id,
                  title: c.title,
                  instructor: `${c.instructor.firstName} ${c.instructor.lastName}`
                }))
              },
              error: 'Could not fetch video metadata'
            })
          }
        } else if (videoId) {
          // Video already processed, just add usage info
          const existingVideo = vimeoVideos.find(v => v.id === videoId)
          if (existingVideo) {
            existingVideo.usage.items.push({
              id: course.id,
              title: course.title,
              instructor: `${course.instructor.firstName} ${course.instructor.lastName}`
            })
          }
        }
      }
    }

    // Sort by most recently modified
    vimeoVideos.sort((a, b) => {
      if (!a.modifiedTime) return 1
      if (!b.modifiedTime) return -1
      return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
    })

    return NextResponse.json({
      videos: vimeoVideos,
      total: vimeoVideos.length,
      summary: {
        totalVideos: vimeoVideos.length,
        totalDuration: vimeoVideos.reduce((sum, v) => sum + v.duration, 0),
        totalPlays: vimeoVideos.reduce((sum, v) => sum + v.stats.plays, 0),
        totalLikes: vimeoVideos.reduce((sum, v) => sum + v.stats.likes, 0)
      }
    })

  } catch (error) {
    console.error('Error fetching Vimeo videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Vimeo videos' },
      { status: 500 }
    )
  }
} 