'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Play, Download, BookOpen, ArrowRight } from 'lucide-react'
import { getDashboardUrl } from '@/lib/auth'

interface CourseData {
  courseId: string
  title: string
  instructor: string
  price: number
}

export default function PaymentSuccessPage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [dashboardUrl, setDashboardUrl] = useState<string>('/dashboard')
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const checkDashboardUrl = () => {
      const url = getDashboardUrl()
      setDashboardUrl(url)
      console.log('Payment Success - dashboardUrl:', url)
    }
    
    checkDashboardUrl()
    
    // Check again after a short delay to ensure localStorage is updated
    const timer = setTimeout(checkDashboardUrl, 100)
    
    // Mock course data - in real app, fetch from API using session_id
    setCourseData({
      courseId: '1',
      title: 'Advanced Dental Techniques',
      instructor: 'Dr. Sarah Johnson',
      price: 299
    })
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. You are now enrolled in the course.
          </p>

          {/* Course Details */}
          {courseData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Details
              </h2>
              <div className="text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{courseData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor:</span>
                  <span className="font-medium">{courseData.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">${courseData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{sessionId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              What's Next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Play className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Start Learning</h4>
                <p className="text-sm text-gray-600">Begin your course immediately</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Download className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Download Resources</h4>
                <p className="text-sm text-gray-600">Access course materials</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor your learning journey</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <Link
              href={`/courses/${courseData?.courseId}`}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning Now
            </Link>
            <Link
              href={dashboardUrl}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">
              You will receive a confirmation email shortly with your course access details.
            </p>
            <div className="text-sm text-gray-500">
              <p>Need help? Contact our support team at support@easyt.online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 