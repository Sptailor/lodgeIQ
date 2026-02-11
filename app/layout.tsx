import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { SessionProvider } from '@/components/SessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { WelcomeScreen } from '@/components/ui/welcome-screen'
import Header from '@/components/Header'
import { Sidebar } from '@/components/sidebar'
import { LayoutWrapper, MainContentWrapper } from '@/components/layout-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'LodgeIQ - Hotel Inspection Platform',
  description: 'Smart Hotel & Resort Inspection Checklist for Tour Operators',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <LayoutWrapper>
              {/* Sidebar Navigation */}
              <Sidebar />

              {/* Main content area with dynamic padding */}
              <MainContentWrapper>
                {/* Header with auth */}
                <Header />

                {/* Main content with transparent background */}
                <main className="min-h-[calc(100vh-4rem)] bg-transparent px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-6 sm:pb-8 lg:pb-10">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </main>

                {/* Enhanced footer */}
                <footer className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800/50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                      <p>© 2026 LodgeIQ. All rights reserved.</p>
                      <div className="flex gap-6">
                        <span className="text-neutral-400 dark:text-neutral-500">v1.0.0</span>
                      </div>
                    </div>
                  </div>
                </footer>
              </MainContentWrapper>
            </LayoutWrapper>

            {/* Toast notifications */}
            <ToastProvider />

            {/* Welcome screen */}
            <WelcomeScreen />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
