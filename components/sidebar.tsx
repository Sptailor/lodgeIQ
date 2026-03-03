/**
 * Sidebar Navigation Component
 *
 * Professional sidebar navigation for desktop with collapsible functionality
 * Bottom tab bar for mobile devices
 * Based on industry research of hotel PMS systems
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  ClipboardCheck,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  User as UserIcon,
  LogOut
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/layout-wrapper'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

interface NavItem {
  label: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Hotels', href: '/hotels', icon: Building2 },
  { label: 'Inspections', href: '/inspections', icon: ClipboardCheck },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, headerHidden } = useSidebar()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Fetch user session on mount
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))
  }, [])

  return (
    <>
      {/* Floating Toggle Button - Only visible when collapsed */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        initial={false}
        animate={{
          opacity: isCollapsed ? 1 : 0,
          scale: isCollapsed ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        className={cn(
          'hidden lg:flex fixed left-4 top-20 z-50 items-center justify-center w-12 h-12',
          'rounded-xl backdrop-blur-md bg-white/90 dark:bg-neutral-900/90',
          'border-2 border-neutral-200 dark:border-neutral-700',
          'hover:border-accent-400 dark:hover:border-accent-500',
          'shadow-lg hover:shadow-xl hover:shadow-accent-500/20 dark:hover:shadow-accent-500/10',
          'group',
          !isCollapsed && 'pointer-events-none'
        )}
        title="Expand sidebar"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-accent-400/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />

        {/* Menu icon */}
        <div className="relative flex flex-col gap-1.5 w-5">
          <div className="h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 rounded-full group-hover:bg-accent-600 dark:group-hover:bg-accent-400 transition-colors" />
          <div className="h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 rounded-full group-hover:bg-accent-600 dark:group-hover:bg-accent-400 transition-colors" />
          <div className="h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 rounded-full group-hover:bg-accent-600 dark:group-hover:bg-accent-400 transition-colors" />
        </div>
      </motion.button>

      {/* Collapsible Navigation Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isCollapsed ? -256 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-white/10 z-40 shadow-glass"
      >
        {/* Close Button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => setIsCollapsed(true)}
            className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group overflow-hidden bg-white/5 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-accent-500/20 border border-white/10 hover:border-primary-500/30 shadow-glass"
            title="Collapse sidebar"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            <span className="relative text-xs font-black uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
              Menu
            </span>

            {/* Close icon (X) */}
            <div className="relative w-5 h-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-white/50 rounded-full rotate-45 group-hover:bg-accent-400 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-white/50 rounded-full -rotate-45 group-hover:bg-accent-400 transition-colors" />
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 via-accent-500/15 to-transparent text-white shadow-lg shadow-primary-500/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white',
                  isActive && 'border-l-4 border-gradient-to-b from-primary-500 to-accent-500 pl-2'
                )}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/15 via-accent-500/10 to-transparent blur-sm" />
                )}

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className={cn(
                  'relative rounded-lg p-2 transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-primary-500/30 to-accent-500/30'
                    : 'bg-white/5 group-hover:bg-white/10'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-all duration-300',
                    'group-hover:scale-110',
                    isActive ? 'text-accent-400' : 'text-white/70 group-hover:text-white'
                  )} />
                </div>

                {!isCollapsed && (
                  <span className="relative truncate">{item.label}</span>
                )}

                {/* Active gradient border */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full" />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-4 py-2 bg-neutral-900/95 backdrop-blur-xl text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all duration-300 shadow-glass z-50 border border-white/10">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-3 h-3 rotate-45 bg-neutral-900/95 border-l border-b border-white/10"></div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </motion.aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-2 p-2.5 rounded-xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-glass hover:bg-neutral-900/80 hover:border-white/20 transition-all duration-300 touch-manipulation ${mobileMenuOpen ? 'z-[80]' : 'z-[60]'}`}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Slide-out Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Menu */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-white/10 z-[70] shadow-glass"
            >
              {/* Mobile Navigation Items */}
              <nav className="flex-1 pt-16 pb-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-primary-500/20 via-accent-500/15 to-transparent text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {/* Active gradient border */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full" />
                      )}
                      <div className={cn(
                        'rounded-lg p-2',
                        isActive
                          ? 'bg-gradient-to-br from-primary-500/30 to-accent-500/30'
                          : 'bg-white/5'
                      )}>
                        <Icon className={cn('w-5 h-5', isActive ? 'text-accent-400' : 'text-white/70')} />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer with Theme Toggle and User Info */}
              <div className="border-t border-white/10 p-4 space-y-3">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/70">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>

                {/* User Info */}
                {user && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-full p-2">
                        <UserIcon className="w-5 h-5 text-accent-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name || user.email}
                        </p>
                        {user.name && user.email && (
                          <p className="text-xs text-white/50 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        window.location.href = '/api/auth/signout'
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-danger-500/20 text-danger-400 hover:bg-danger-500/30 transition-colors border border-danger-500/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
