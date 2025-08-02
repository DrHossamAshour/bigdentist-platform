'use client'

import { useState, useEffect } from 'react'
import { isLoggedIn, getUserRole, getDashboardUrl } from '@/lib/auth'

export default function DebugPage() {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userRole: null as string | null,
    dashboardUrl: '/dashboard',
    localStorage: {} as any,
    cookies: ''
  })

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isLoggedIn()
      const role = getUserRole()
      const url = getDashboardUrl()
      
      setAuthState({
        isLoggedIn: loggedIn,
        userRole: role,
        dashboardUrl: url,
        localStorage: {
          isLoggedIn: localStorage.getItem('isLoggedIn'),
          userData: localStorage.getItem('userData'),
          parsedUserData: (() => {
            try {
              const data = localStorage.getItem('userData')
              return data ? JSON.parse(data) : null
            } catch (e) {
              return 'Error parsing'
            }
          })()
        },
        cookies: document.cookie
      })
    }

    checkAuth()
    const interval = setInterval(checkAuth, 1000)
    return () => clearInterval(interval)
  }, [])

  const setAdminLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userData', JSON.stringify({
      id: 'test-admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      firstName: 'Test',
      lastName: 'Admin'
    }))
    window.location.reload()
  }

  const clearAuth = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userData')
    document.cookie = "auth-token=; Max-Age=0; path=/"
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <div className="space-y-2">
              <p><strong>Is Logged In:</strong> {authState.isLoggedIn ? '✅ Yes' : '❌ No'}</p>
              <p><strong>User Role:</strong> {authState.userRole || 'None'}</p>
              <p><strong>Dashboard URL:</strong> {authState.dashboardUrl}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={setAdminLogin}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                Set Admin Login
              </button>
              <button
                onClick={clearAuth}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Clear All Auth
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">localStorage</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authState.localStorage, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Cookies</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {authState.cookies || 'No cookies found'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 