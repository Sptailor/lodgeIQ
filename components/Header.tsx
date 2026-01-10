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
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { MobileNav } from '@/components/mobile-nav'
import { Logo } from '@/components/Logo'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-accent-700 dark:border-accent-900 shadow-sm">
      {/* Desktop: Logo section - fixed width to match sidebar */}
      <div className="hidden lg:flex items-center w-64 h-full px-6 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-9 h-9 text-white" />
          <div>
            <h1 className="text-lg font-bold text-white">
              LodgeIQ
            </h1>
            <p className="text-xs text-white/80 font-medium">
              Inspection Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Main header content area */}
      <div className="flex-1 h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60">
        {/* Mobile: Logo and brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group lg:hidden"
        >
          <Logo className="w-10 h-10 text-accent-600 dark:text-accent-400" />
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
              LodgeIQ
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium hidden sm:block">
              Inspection Platform
            </p>
          </div>
        </Link>

        {/* Desktop: Spacer */}
        <div className="hidden lg:flex flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ThemeToggle />

          {session?.user ? (
            <>
              {/* User menu - desktop */}
              <div className="hidden sm:block">
                <UserMenu user={session.user} />
              </div>

              {/* Mobile menu */}
              <div className="md:hidden">
                <MobileNav user={session.user} />
              </div>
            </>
          ) : (
            /* Sign in link */
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
