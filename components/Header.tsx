/**
 * Header Component
 *
 * Professional app header with navigation, dark mode, and user menu
 * Travel-industry inspired design with smooth interactions
 *
 * AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
 * Uses mock session from auth-utils
 */

import Link from 'next/link'
import { getSession } from '@/lib/auth-utils'
import { ClipboardCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { MobileHeader } from '@/components/MobileHeader'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-accent-700 dark:border-accent-900 shadow-sm">
      {/* Desktop: Logo section - fixed width to match sidebar */}
      <div className="hidden lg:flex items-center w-64 h-full px-6 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              LodgeIQ
            </h1>
            <p className="text-[10px] text-white/60 font-normal tracking-wide">
              Property Inspection & Compliance
            </p>
          </div>
        </Link>
      </div>

      {/* Main header content area */}
      <div className="flex-1 h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900">
        {/* Mobile: Logo and brand - with scroll detection */}
        <MobileHeader />

        {/* Desktop: Spacer */}
        <div className="hidden lg:flex flex-1" />

        {/* Right side actions - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme toggle - desktop only */}
          <ThemeToggle />

          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-glow transition-all shadow-soft"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
