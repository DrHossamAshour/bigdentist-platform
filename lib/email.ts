import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send email function
export const sendEmail = async (options: EmailOptions) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"BigDentist" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName: string) => ({
    subject: 'Reset Your Password - BigDentist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0EA5E9;">Reset Your Password</h2>
        <p>Hello ${userName},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The BigDentist Team
        </p>
      </div>
    `,
    text: `
      Reset Your Password - BigDentist
      
      Hello ${userName},
      
      You requested to reset your password. Click the link below to create a new password:
      ${resetUrl}
      
      If you didn't request this, you can safely ignore this email.
      This link will expire in 1 hour.
      
      Best regards,
      The BigDentist Team
    `
  }),

  orderConfirmation: (orderDetails: any, userName: string) => ({
    subject: 'Order Confirmation - BigDentist',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0EA5E9;">Order Confirmation</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for your purchase! Here are your order details:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order #${orderDetails.id}</h3>
          <p><strong>Course:</strong> ${orderDetails.courseTitle}</p>
          <p><strong>Amount:</strong> $${orderDetails.amount}</p>
          <p><strong>Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString()}</p>
        </div>
        
        <p>You can now access your course in your dashboard.</p>
        
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Go to Dashboard
        </a>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The BigDentist Team
        </p>
      </div>
    `,
    text: `
      Order Confirmation - BigDentist
      
      Hello ${userName},
      
      Thank you for your purchase! Here are your order details:
      
      Order #${orderDetails.id}
      Course: ${orderDetails.courseTitle}
      Amount: $${orderDetails.amount}
      Date: ${new Date(orderDetails.createdAt).toLocaleDateString()}
      
      You can now access your course in your dashboard.
      ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard
      
      Best regards,
      The BigDentist Team
    `
  }),

  welcomeEmail: (userName: string) => ({
    subject: 'Welcome to BigDentist!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0EA5E9;">Welcome to BigDentist!</h2>
        <p>Hello ${userName},</p>
        <p>Welcome to BigDentist! We're excited to have you join our learning community.</p>
        
        <p>Here's what you can do to get started:</p>
        <ul>
          <li>Browse our course catalog</li>
          <li>Enroll in courses that interest you</li>
          <li>Track your learning progress</li>
          <li>Connect with other learners</li>
        </ul>
        
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/courses" style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Explore Courses
        </a>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          The BigDentist Team
        </p>
      </div>
    `,
    text: `
      Welcome to BigDentist!
      
      Hello ${userName},
      
      Welcome to BigDentist! We're excited to have you join our learning community.
      
      Here's what you can do to get started:
      - Browse our course catalog
      - Enroll in courses that interest you
      - Track your learning progress
      - Connect with other learners
      
      Explore Courses: ${process.env.NEXT_PUBLIC_BASE_URL}/courses
      
      Best regards,
      The BigDentist Team
    `
  })
} 