import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LodgeIQ',
  description: 'Hotel and lodge inspections for tour operators',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0C0D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistSans.className}`}>
        {children}
        {/* Vercel Web Analytics: cookieless page view counts. It only reports on Vercel deployments. */}
        <Analytics />
      </body>
    </html>
  )
}
