# Vimeo Integration for BigDentist Platform

This document explains the Vimeo integration features implemented for managing external Vimeo videos used in courses.

## 🎯 Overview

The Vimeo integration provides:
- **Centralized video management** for all Vimeo videos used in courses
- **Real-time validation** of Vimeo URLs with metadata fetching
- **Video previews** and analytics in the admin dashboard
- **Automatic error detection** for broken or private videos
- **Usage tracking** to see which courses use each video

## 🚀 Features Implemented

### 1. Vimeo Video Management Dashboard
- **Location:** `/admin/vimeo`
- **Features:**
  - View all Vimeo videos used across courses
  - Search and filter videos by status, title, or instructor
  - Grid and list view modes
  - Video thumbnails, duration, and analytics
  - Status indicators (valid, error, private)
  - Copy embed URLs with one click

### 2. Real-time Video URL Validation
- **API Endpoint:** `/api/admin/vimeo/validate`
- **Features:**
  - Validates Vimeo URLs instantly
  - Fetches video metadata (title, description, duration, stats)
  - Checks video privacy settings
  - Returns formatted embed URLs

### 3. Video Usage Tracking
- **API Endpoint:** `/api/admin/vimeo/videos`
- **Features:**
  - Scans all courses for Vimeo video URLs
  - Shows which courses use each video
  - Provides usage statistics and analytics
  - Detects duplicate video usage

### 4. Reusable Video Input Component
- **Component:** `VimeoVideoInput`
- **Features:**
  - Real-time URL validation
  - Video preview with thumbnail
  - Embed URL copying
  - Error handling and user feedback

## ⚙️ Setup Instructions

### 1. Vimeo API Configuration

#### Step 1: Create Vimeo App
1. Go to [Vimeo Developer Portal](https://developer.vimeo.com/)
2. Create a new app
3. Note your **Client ID** and **Client Secret**

#### Step 2: Generate Access Token
1. In your Vimeo app settings, generate an access token
2. Choose appropriate scopes (minimum: `public` for public videos)
3. Copy the access token

#### Step 3: Environment Variables
Add these to your `.env` file:

```env
# Vimeo API Configuration
VIMEO_ACCESS_TOKEN="your-vimeo-access-token"
VIMEO_CLIENT_ID="your-vimeo-client-id"
VIMEO_CLIENT_SECRET="your-vimeo-client-secret"
```

### 2. Database Migration
The system uses your existing course structure. No additional database changes are needed.

### 3. Access the Features
1. **Admin Dashboard:** Navigate to `/admin/vimeo`
2. **Course Creation:** Use the `VimeoVideoInput` component in course forms
3. **API Endpoints:** Available for custom integrations

## 📖 Usage Guide

### For Admins

#### Managing Vimeo Videos
1. Go to **Admin Dashboard** → **Vimeo Videos**
2. View all videos used in courses
3. Use search and filters to find specific videos
4. Check video status (valid, error, private)
5. Copy embed URLs for reuse

#### Monitoring Video Health
- **Green Status:** Video is valid and accessible
- **Yellow Status:** Video is private (may not embed properly)
- **Red Status:** Video not found or API error

### For Course Creators

#### Adding Vimeo Videos to Courses
1. In course creation/editing form, use the video URL field
2. Paste a Vimeo URL (supports multiple formats):
   - `https://vimeo.com/123456789`
   - `https://vimeo.com/video/123456789`
   - `https://player.vimeo.com/video/123456789`
3. The system will automatically validate and show preview
4. Save the course

#### Video Input Component Features
- **Real-time validation:** See validation status as you type
- **Video preview:** View thumbnail and basic info
- **Embed URL:** Copy the embed URL for use elsewhere
- **Error handling:** Clear error messages for invalid URLs

## 🔧 API Reference

### Validate Video URL
```http
POST /api/admin/vimeo/validate
Content-Type: application/json

{
  "url": "https://vimeo.com/123456789"
}
```

**Response:**
```json
{
  "isValid": true,
  "video": {
    "id": "123456789",
    "title": "Video Title",
    "description": "Video description...",
    "duration": "5:30",
    "thumbnail": "https://vumbnail.com/123456789_1280x720.jpg",
    "embedUrl": "https://player.vimeo.com/video/123456789",
    "privacy": "anybody",
    "stats": {
      "plays": 1000,
      "likes": 50
    }
  }
}
```

### Get All Videos
```http
GET /api/admin/vimeo/videos
```

**Response:**
```json
{
  "videos": [...],
  "total": 24,
  "summary": {
    "totalVideos": 24,
    "totalDuration": 7200,
    "totalPlays": 50000,
    "totalLikes": 2500
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Vimeo access token not configured"
**Solution:** Add `VIMEO_ACCESS_TOKEN` to your environment variables

#### 2. "Video not found or is private"
**Solution:** 
- Check if the video URL is correct
- Ensure the video is public or accessible with your API token
- Verify the video hasn't been deleted

#### 3. "Invalid Vimeo URL format"
**Solution:** Use one of these supported formats:
- `https://vimeo.com/123456789`
- `https://vimeo.com/video/123456789`
- `https://player.vimeo.com/video/123456789`

#### 4. API Rate Limiting
**Solution:** 
- Vimeo has rate limits (typically 1000 requests/hour)
- The system caches video metadata to reduce API calls
- Consider implementing additional caching if needed

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_VIMEO=true
```

## 🔒 Security Considerations

1. **API Token Security:**
   - Keep your Vimeo access token secure
   - Use environment variables, never hardcode
   - Rotate tokens regularly

2. **Video Privacy:**
   - Only public videos can be embedded
   - Private videos will show warnings
   - Consider video access permissions

3. **Rate Limiting:**
   - Monitor API usage
   - Implement caching for frequently accessed videos
   - Handle rate limit errors gracefully

## 🚀 Future Enhancements

### Planned Features
1. **Bulk Video Import:** Import videos from Vimeo playlists
2. **Video Analytics:** Track video performance across courses
3. **Automatic Thumbnails:** Generate course thumbnails from videos
4. **Video Scheduling:** Schedule video availability
5. **Advanced Search:** Search by video content, tags, or metadata

### Customization Options
1. **Custom Embed Parameters:** Configure player options
2. **Video Categories:** Organize videos by type or topic
3. **Usage Analytics:** Track which videos are most popular
4. **Integration Hooks:** Custom callbacks for video events

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check Vimeo API documentation
4. Contact the development team

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Vimeo video management dashboard
- ✅ Real-time URL validation
- ✅ Video preview component
- ✅ Usage tracking
- ✅ Error handling and status indicators
- ✅ API endpoints for validation and listing 