import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      // Generate token
      const token = crypto.randomBytes(32).toString('hex')
      const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
      
      // Save token to user
      await prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: expires,
        },
      })

      // Create reset URL
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`
      
      // Send email
      const emailContent = emailTemplates.passwordReset(resetUrl, user.firstName)
      const emailResult = await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      })

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error)
        // Still return success for security reasons
      }
    }
    
    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({ 
      message: 'If this email is registered, a password reset link has been sent.' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ 
      message: 'If this email is registered, a password reset link has been sent.' 
    })
  }
} 