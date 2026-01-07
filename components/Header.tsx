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
import { Building2, Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { MobileNav } from '@/components/mobile-nav'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-accent-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand - Only show on mobile (sidebar shows it on desktop) */}
          <Link
            href="/"
            className="flex items-center gap-3 group lg:hidden"
          >
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-2.5 shadow-md group-hover:shadow-lg transition-shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                LodgeIQ
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium hidden sm:block">
                Inspection Platform
              </p>
            </div>
          </Link>

          {/* Desktop: Spacer to push actions to the right */}
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
      </div>
    </header>
  )
}
