/**
 * Header Component
 *
 * Professional app header with navigation, dark mode, and user menu
 * Travel-industry inspired design with smooth interactions
 *
 * AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
 * Uses mock session from auth-utils
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClipboardCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { MobileHeader } from '@/components/MobileHeader'
import { useSidebar } from '@/components/layout-wrapper'

export default function Header() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [session, setSession] = useState<any>(null)
  const { setHeaderHidden } = useSidebar()

  useEffect(() => {
    // Fetch session on mount
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setSession(data))
      .catch(() => setSession(null))
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollDifference = Math.abs(currentScrollY - lastScrollY)

          // Only update if scroll difference is significant (prevents micro-scrolls)
          if (scrollDifference > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling down and past threshold
              setScrollDirection('down')
              setHeaderHidden(true)
            } else if (currentScrollY < lastScrollY) {
              // Scrolling up
              setScrollDirection('up')
              setHeaderHidden(false)
            }

            setLastScrollY(currentScrollY)
          }

          ticking = false
        })

        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-primary-200 dark:border-primary-700 bg-white/95 dark:bg-primary-900/95 backdrop-blur-md shadow-sm dark:shadow-none transition-transform duration-300 ${scrollDirection === 'down' ? 'lg:translate-y-0 -translate-y-full' : 'translate-y-0'}`}>
      {/* Desktop: Logo section - fixed width to match sidebar */}
      <div className="hidden lg:flex items-center w-64 h-full px-7 bg-primary-50 dark:bg-primary-800/50 flex-shrink-0 border-r border-primary-200 dark:border-primary-700">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative bg-accent-500 hover:bg-accent-600 rounded-xl p-2.5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-extrabold text-primary-900 dark:text-white tracking-tight leading-none">
              LodgeIQ
            </h1>
            <p className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wide leading-tight">
              Property Inspection & Compliance
            </p>
          </div>
        </Link>
      </div>

      {/* Main header content area */}
      <div className="flex-1 h-full flex items-center justify-between lg:px-8 bg-transparent">
        {/* Mobile: Logo and brand - with scroll detection */}
        <MobileHeader />

        {/* Desktop: Spacer */}
        <div className="hidden lg:flex flex-1" />

        {/* Right side actions - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme toggle - desktop only */}
          <ThemeToggle />

          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Link
              href="/auth/signin"
              className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
