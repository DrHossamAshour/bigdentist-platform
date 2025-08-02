'use client'

import { useState, useEffect } from 'react'
import { getUserRole, isLoggedIn, getDashboardUrl } from '@/lib/auth'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const info = {
      isLoggedIn: isLoggedIn(),
      userRole: getUserRole(),
      dashboardUrl: getDashboardUrl(),
      cookies: document.cookie,
      localStorage: {
        isLoggedIn: localStorage.getItem('isLoggedIn')
      }
    }
    setDebugInfo(info)
    console.log('Debug info:', info)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            <p><strong>Is Logged In:</strong> {debugInfo.isLoggedIn ? 'Yes' : 'No'}</p>
            <p><strong>User Role:</strong> {debugInfo.userRole || 'None'}</p>
            <p><strong>Dashboard URL:</strong> {debugInfo.dashboardUrl}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {debugInfo.cookies || 'No cookies'}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(debugInfo.localStorage, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                localStorage.setItem('isLoggedIn', 'true')
                window.location.reload()
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Set Logged In (Local Storage)
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn')
                document.cookie = "auth-token=; Max-Age=0; path=/"
                window.location.reload()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded ml-4"
            >
              Clear All Auth
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 