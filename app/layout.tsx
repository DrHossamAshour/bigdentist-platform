import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import AppShell from '@/components/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BigDentist - Excel & Sell in Dentistry',
    template: '%s | BigDentist'
  },
  description: 'Learn from the best dental professionals. Master dentistry techniques, business strategies, and patient care with our comprehensive online courses.',
  keywords: ['dentistry', 'dental courses', 'online learning', 'dental education', 'dental business', 'patient care', 'dental techniques'],
  authors: [{ name: 'BigDentist Team' }],
  creator: 'BigDentist',
  publisher: 'BigDentist',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    title: 'BigDentist - Excel & Sell in Dentistry',
    description: 'Learn from the best dental professionals. Master dentistry techniques, business strategies, and patient care with our comprehensive online courses.',
    siteName: 'BigDentist',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BigDentist - Online Dental Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigDentist - Excel & Sell in Dentistry',
    description: 'Learn from the best dental professionals. Master dentistry techniques, business strategies, and patient care with our comprehensive online courses.',
    images: ['/og-image.jpg'],
    creator: '@bigdentist',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "BigDentist",
              "description": "Online learning platform for dental professionals",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
              "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/logo.png`,
              "sameAs": [
                "https://facebook.com/bigdentist",
                "https://twitter.com/bigdentist",
                "https://instagram.com/bigdentist",
                "https://youtube.com/bigdentist"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-123-4567",
                "contactType": "customer service",
                "email": "info@bigdentist.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "addressCountry": "US"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
} 