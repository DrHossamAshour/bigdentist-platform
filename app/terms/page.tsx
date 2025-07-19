import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using BigDentist ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              BigDentist is an online learning platform that provides educational courses, content, and resources related to dentistry and business. The Platform allows users to enroll in courses, access educational materials, and interact with instructors and other students.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Platform, you must create an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>4. Course Enrollment and Payment</h2>
            <p>
              Course enrollment requires payment of the specified fee. All payments are processed securely through our payment partners. Refunds are subject to our refund policy.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on the Platform, including but not limited to courses, videos, text, graphics, and software, is the property of BigDentist or its content providers and is protected by copyright laws.
            </p>

            <h2>6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any unlawful purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Interfere with or disrupt the Platform's operation</li>
              <li>Upload or transmit harmful content</li>
            </ul>

            <h2>7. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform.
            </p>

            <h2>8. Disclaimers</h2>
            <p>
              The Platform is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be error-free or uninterrupted.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              BigDentist shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              Email: legal@bigdentist.com<br />
              Phone: +1-555-123-4567<br />
              Address: New York, NY, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 