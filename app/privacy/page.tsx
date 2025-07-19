import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Enroll in courses</li>
              <li>Make payments</li>
              <li>Contact our support team</li>
              <li>Participate in discussions or forums</li>
            </ul>

            <h3>Personal Information</h3>
            <p>This may include:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Payment information</li>
              <li>Educational background and preferences</li>
              <li>Course progress and completion data</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our Platform:</p>
            <ul>
              <li>Device information and IP address</li>
              <li>Browser type and version</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process payments and enrollments</li>
              <li>Send important updates and notifications</li>
              <li>Personalize your learning experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            <ul>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information:</p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure payment processing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>

            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site traffic</li>
              <li>Improve user experience</li>
              <li>Provide personalized content</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to:</p>
            <ul>
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>Our Platform is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>

            <h2>9. International Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our Platform.</p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: privacy@bigdentist.com<br />
              Phone: +1-555-123-4567<br />
              Address: New York, NY, USA
            </p>

            <h2>12. California Privacy Rights</h2>
            <p>California residents have additional rights under the California Consumer Privacy Act (CCPA). Please contact us for more information.</p>

            <h2>13. GDPR Compliance</h2>
            <p>If you are in the European Union, you have additional rights under the General Data Protection Regulation (GDPR). Please contact us for more information.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 