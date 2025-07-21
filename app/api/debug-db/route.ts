import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const dbUrl = process.env.DATABASE_URL
  
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