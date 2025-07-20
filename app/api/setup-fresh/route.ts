import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Setting up fresh database...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create admin user with proper password hash
    const adminPassword = await bcrypt.hash('Dr.hossam@123', 12)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@bigdentist.com' },
      update: {},
      create: {
        email: 'admin@bigdentist.com',
        firstName: 'hossam',
        lastName: 'ashour',
        password: adminPassword,
        role: 'SUPER_ADMIN',
      },
    })
    
    console.log('✅ Admin user created:', adminUser.email)
    
    // Create test student user
    const studentPassword = await bcrypt.hash('test123', 12)
    const studentUser = await prisma.user.upsert({
      where: { email: 'student@bigdentist.com' },
      update: {},
      create: {
        email: 'student@bigdentist.com',
        firstName: 'Test',
        lastName: 'Student',
        password: studentPassword,
        role: 'STUDENT',
      },
    })
    
    console.log('✅ Student user created:', studentUser.email)
    
    return NextResponse.json({
      success: true,
      message: 'Fresh database setup completed!',
      users: [
        { email: 'admin@bigdentist.com', password: 'Dr.hossam@123', role: 'SUPER_ADMIN' },
        { email: 'student@bigdentist.com', password: 'test123', role: 'STUDENT' }
      ]
    })
    
  } catch (error) {
    console.error('❌ Setup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Setup failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 