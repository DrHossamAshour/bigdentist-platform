import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAdminAuth } from '@/lib/adminAuth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = verifyAdminAuth(request);
  if (!authResult.success) {
    return authResult.error!;
  }

  try {
    console.log('Setting up database...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'admin@bigdentist.com' },
      update: {},
      create: {
        email: 'admin@bigdentist.com',
        firstName: 'Admin',
        lastName: 'User',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iKGi', // Dr.hossam@123
        role: 'ADMIN',
      },
    })
    
    console.log('✅ Test user created:', testUser.email)
    
    // SECURITY: Return safe user information without password
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      user: {
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: testUser.role,
      }
    })
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 