import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = verifyAdminAuth(request);
  if (!authResult.success) {
    return authResult.error!;
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        // SECURITY: Never include password field in responses
        // password: false - explicitly excluded
      }
    });

    return NextResponse.json({
      success: true,
      userCount: users.length,
      users: users,
      // Add some basic statistics without exposing sensitive data
      roleDistribution: {
        students: users.filter((u: any) => u.role === 'STUDENT').length,
        admins: users.filter((u: any) => u.role === 'ADMIN').length,
        superAdmins: users.filter((u: any) => u.role === 'SUPER_ADMIN').length,
        instructors: users.filter((u: any) => u.role === 'INSTRUCTOR').length,
      }
    });

  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 