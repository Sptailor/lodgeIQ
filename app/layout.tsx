import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toast'
import Header from '@/components/Header'
import { Sidebar } from '@/components/sidebar'
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Layout Container */}
            <div className="lg:pl-64">
              {/* Header with auth */}
              <Header />

              {/* Main content with proper spacing for mobile bottom nav */}
              <main className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>

              {/* Enhanced footer */}
              <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
                    © 2024 LodgeIQ - Professional Hotel Inspection Platform
                  </div>
                </div>
              </footer>
            </div>

            {/* Toast notifications */}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
