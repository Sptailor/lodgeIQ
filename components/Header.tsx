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
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-tertiary-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-2 group-hover:from-primary-600 group-hover:to-tertiary-600 transition-all duration-300 shadow-soft">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-50 dark:to-neutral-300 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-tertiary-600 transition-all duration-300">
                LodgeIQ
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                Hotel Inspection Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Hotels
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Inspections
            </Link>
          </nav>

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
