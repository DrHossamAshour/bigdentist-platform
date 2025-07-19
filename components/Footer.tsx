'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const footerLinks = {
    about: [
      { name: 'About Us', href: '/about' },
      { name: 'Payment Methods', href: '/payment-methods' },
      { name: 'Become an Instructor', href: '/become-instructor' },
      { name: 'Affiliate Program', href: '/affiliate' },
      { name: 'Community Forum', href: '/forum' },
      { name: 'How to Use & Purchase', href: '/how-to-use' },
      { name: 'FAQ', href: '/faq' },
    ],
    courses: [
      { name: 'My Courses', href: '/my-courses' },
      { name: 'Monthly Courses', href: '/monthly-courses' },
      { name: 'All Courses', href: '/courses' },
      { name: 'Diplomas', href: '/diplomas' },
      { name: 'Books & Resources', href: '/books' },
      { name: 'Subscriptions', href: '/subscriptions' },
      { name: 'Instructors', href: '/instructors' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Youtube', href: '#', icon: Youtube },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4 hover:text-primary-400 transition-colors">
              <Image src="/logo.png" alt="BigDentist Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              BigDentist
            </Link>
            <p className="text-gray-300 mb-6">
              BigDentist is a modern e-learning platform offering diverse courses to help you excel and sell in dentistry and business.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">info@bigdentist.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">+1 555 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">New York, NY, USA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-2">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest courses and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              &copy; 2025 BigDentist. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-300 hover:text-primary-400 text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 