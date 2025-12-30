import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import Header from '@/components/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LodgeIQ - Hotel Inspection Platform',
  description: 'Smart Hotel & Resort Inspection Checklist for Tour Operators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {/* Header with auth */}
          <Header />

          {/* Main content */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Simple footer */}
          <footer className="bg-gray-100 border-t mt-12">
            <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
              © 2024 LodgeIQ - B2B SaaS Hotel Inspection Platform
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
