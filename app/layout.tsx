import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toast'
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {/* Header with auth */}
            <Header />

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>

            {/* Enhanced footer */}
            <footer className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-12">
              <div className="container mx-auto px-4 py-4 text-center text-neutral-600 dark:text-neutral-400 text-sm">
                © 2024 LodgeIQ - B2B SaaS Hotel Inspection Platform
              </div>
            </footer>

            {/* Toast notifications */}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
