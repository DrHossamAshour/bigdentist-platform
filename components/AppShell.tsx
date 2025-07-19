"use client"
import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/instructor')
  return (
    <>
      {!isProtected && <Header />}
      <main>{children}</main>
      {!isProtected && <Footer />}
    </>
  )
} 