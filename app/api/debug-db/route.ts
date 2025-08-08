/*
 * SECURITY WARNING: This endpoint has been disabled for production safety
 * 
 * This endpoint was exposing the full DATABASE_URL and environment variables,
 * which poses a critical security risk by leaking database credentials.
 * 
 * If needed for development, ensure it:
 * 1. Requires admin authentication
 * 2. Never returns full connection strings
 * 3. Is not accessible in production
 */

import { NextRequest, NextResponse } from 'next/server'
import { createErrorResponse } from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  return createErrorResponse(
    'Endpoint disabled', 
    'This endpoint has been disabled for security reasons',
    410
  )
}

/*
// COMMENTED OUT FOR SECURITY - Original implementation below
export async function GET(request: NextRequest) {
  const dbUrl = process.env.DATABASE_URL
  
  // SECURITY ISSUE: Never expose full DATABASE_URL or environment details!
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    hasDatabaseUrl: !!dbUrl,
    databaseUrlLength: dbUrl ? dbUrl.length : 0,
    databaseUrlStart: dbUrl ? dbUrl.substring(0, 20) : 'NOT_SET',
    databaseUrlEnd: dbUrl ? dbUrl.substring(dbUrl.length - 20) : 'NOT_SET',
    fullDatabaseUrl: dbUrl || 'NOT_SET',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('DATABASE'))
  })
}
*/ 