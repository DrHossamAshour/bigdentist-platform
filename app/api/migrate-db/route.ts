import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    console.log('Starting database migration...');
    
    // Run Prisma db push to create all tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    
    console.log('Migration output:', stdout);
    if (stderr) {
      console.log('Migration stderr:', stderr);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      output: stdout,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 