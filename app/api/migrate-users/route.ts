import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyAdminAuth } from '@/lib/adminAuth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  return await migrateUsers(request)
}

export async function POST(request: NextRequest) {
  return await migrateUsers(request)
}

async function migrateUsers(request: NextRequest) {
  // Verify admin authentication
  const authResult = verifyAdminAuth(request);
  if (!authResult.success) {
    return authResult.error!;
  }

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
    
    // SECURITY: Return safe user information without passwords
    return NextResponse.json({
      success: true,
      message: 'Users migrated successfully',
      users: [
        { 
          email: adminUser.email, 
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role 
        },
        { 
          email: studentUser.email, 
          firstName: studentUser.firstName,
          lastName: studentUser.lastName,
          role: studentUser.role 
        }
      ]
    })
    
  } catch (error) {
    console.error('❌ Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 