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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-neutral-200/50 dark:border-neutral-800 shadow-sm">
      {/* Desktop: Logo section - fixed width to match sidebar */}
      <div className="hidden lg:flex items-center w-64 h-full px-7 bg-gradient-to-r from-white via-neutral-50 to-transparent dark:from-accent-800/90 dark:via-accent-800/60 dark:to-neutral-900/40 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-700">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:bg-white/25 rounded-lg p-2.5 group-hover:shadow-lg dark:group-hover:bg-white/30 transition-all">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none">
              LodgeIQ
            </h1>
            <p className="text-[10px] text-neutral-600 dark:text-white/60 font-normal tracking-wide leading-tight">
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
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
