import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Fixing login users...');
    
    // Delete existing users to start fresh
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['admin@bigdentist.com', 'student@bigdentist.com']
        }
      }
    });
    
    // Create admin user with correct password
    const adminPassword = await bcrypt.hash('Dr.hossam@123', 12);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@bigdentist.com',
        firstName: 'Admin',
        lastName: 'User',
        password: adminPassword,
        role: 'SUPER_ADMIN',
      },
    });
    
    // Create student user with correct password
    const studentPassword = await bcrypt.hash('test123', 12);
    const studentUser = await prisma.user.create({
      data: {
        email: 'student@bigdentist.com',
        firstName: 'Test',
        lastName: 'Student',
        password: studentPassword,
        role: 'STUDENT',
      },
    });
    
    console.log('✅ Users created successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Login users fixed!',
      users: [
        { email: 'admin@bigdentist.com', password: 'Dr.hossam@123', role: 'SUPER_ADMIN' },
        { email: 'student@bigdentist.com', password: 'test123', role: 'STUDENT' }
      ]
    });
    
  } catch (error) {
    console.error('❌ Fix login error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fix login', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 