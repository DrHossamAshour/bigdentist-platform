import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Environment test',
    vimeoTokenExists: !!process.env.VIMEO_ACCESS_TOKEN,
    vimeoTokenValue: process.env.VIMEO_ACCESS_TOKEN ? `${process.env.VIMEO_ACCESS_TOKEN.substring(0, 10)}...` : 'NOT SET',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('VIMEO')),
    nodeEnv: process.env.NODE_ENV
  })
} 