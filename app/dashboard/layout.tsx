// app/dashboard/layout.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

function handleLogout() {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth-token=; Max-Age=0; path=/';
    window.location.href = '/login';
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 