import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting user migration...')
    
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@bigdentist.com' },
      update: {},
      create: {
        email: 'admin@bigdentist.com',
        firstName: 'hossam',
        lastName: 'ashour',
        password: '$2a$12$11ELuJqS6rhdc...', // Your actual password hash
        role: 'SUPER_ADMIN',
      },
    })
    
    console.log('✅ Admin user created/updated:', adminUser.email)
    
    // Create test student user
    const studentUser = await prisma.user.upsert({
      where: { email: 'm@m.com' },
      update: {},
      create: {
        email: 'm@m.com',
        firstName: 'Amr',
        lastName: 'Abo',
        password: '$2a$12$11ELuJqS6rhdc...', // You'll need to set a password
        role: 'STUDENT',
      },
    })
    
    console.log('✅ Student user created/updated:', studentUser.email)
    
    return NextResponse.json({
      message: 'Users migrated successfully',
      users: [adminUser.email, studentUser.email]
    })
    
  } catch (error) {
    console.error('❌ Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    )
  }
} 