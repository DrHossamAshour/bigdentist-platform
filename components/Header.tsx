'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, BookOpen, Users, Star, Home } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { isLoggedIn, getDashboardUrl, handleLogout, getUserRole } from '@/lib/auth'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Subscriptions', href: '/subscriptions', icon: Star },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined)
  const [clientPath, setClientPath] = useState<string | undefined>(undefined)
  const pathname = usePathname()

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    setClientPath(window.location.pathname)
  }, [pathname]);

  // Calculate dashboard URL dynamically
  const dashboardUrl = getDashboardUrl()
  
  // Debug logging
  console.log('Header - loggedIn:', loggedIn)
  console.log('Header - dashboardUrl:', dashboardUrl)
  console.log('Header - user role:', getUserRole())

  if (loggedIn === undefined || clientPath === undefined) {
    return null // Wait for client check
  }
  
  // Normalize pathname: remove trailing slash
  const cleanPath = typeof clientPath === 'string' ? clientPath.replace(/\/$/, '') : ''
  // Check if we're on auth pages (login, register, forgot-password)
  const isAuthPage = cleanPath === '/login' || cleanPath === '/register' || cleanPath === '/forgot-password'
  
  const isDashboard = loggedIn && (
    cleanPath === '/dashboard' ||
    cleanPath.startsWith('/dashboard/') ||
    cleanPath === '/admin' ||
    cleanPath.startsWith('/admin/') ||
    cleanPath === '/instructor' ||
    cleanPath.startsWith('/instructor/')
  )

  // If we're on an auth page, dontshow the header at all
  if (isAuthPage) {
    return null
  }

  if (isDashboard) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="BigDentist Logo" width={40} height={40} className="h-10 w-10 object-contain" />
                <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">BigDentist</span>
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="BigDentist Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">BigDentist</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isDashboard && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <>
                <Link 
                  href={dashboardUrl}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Go to Dashboard ({getUserRole() || 'Unknown'})
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {!isDashboard && navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {loggedIn ? (
                  <>
                    <Link 
                      href={dashboardUrl}
                      className="bg-primary-600 hover:bg-primary-700 text-white block w-full text-left px-3 py-2 rounded-lg text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Go to Dashboard ({getUserRole() || 'Unknown'})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-lg text-base font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      className="text-gray-700 hover:text-primary-600 block w-full text-left px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register"
                      className="bg-primary-600 hover:bg-primary-700 text-white block w-full text-left px-3 py-2 rounded-lg text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 