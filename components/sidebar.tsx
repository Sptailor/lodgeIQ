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
  const { isCollapsed, setIsCollapsed } = useSidebar()
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
        className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 shadow-xl"
      >
        {/* Close Button */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setIsCollapsed(true)}
            className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group overflow-hidden bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800/50 hover:from-accent-50 hover:to-accent-100 dark:hover:from-accent-900/30 dark:hover:to-accent-900/10 border-2 border-neutral-200 dark:border-neutral-700 hover:border-accent-400 dark:hover:border-accent-600 shadow-sm hover:shadow-lg hover:shadow-accent-500/20 dark:hover:shadow-accent-500/10"
            title="Collapse sidebar"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            <span className="relative text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 group-hover:text-accent-700 dark:group-hover:text-accent-400 transition-colors">
              Menu
            </span>

            {/* Close icon (X) */}
            <div className="relative w-5 h-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-700 dark:bg-neutral-300 rounded-full rotate-45 group-hover:bg-accent-600 dark:group-hover:bg-accent-400 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-700 dark:bg-neutral-300 rounded-full -rotate-45 group-hover:bg-accent-600 dark:group-hover:bg-accent-400 transition-colors" />
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
                    ? 'bg-gradient-to-r from-accent-100 via-accent-50 to-accent-100/50 dark:from-accent-900/50 dark:via-accent-900/30 dark:to-accent-900/10 text-accent-700 dark:text-accent-300 shadow-md shadow-accent-500/20'
                    : 'text-neutral-700 dark:text-neutral-400 hover:bg-gradient-to-r hover:from-neutral-100 hover:to-neutral-50 dark:hover:from-neutral-800 dark:hover:to-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200 hover:shadow-md',
                  isActive && 'border-l-4 border-accent-600 dark:border-accent-500 pl-2'
                )}
              >
                {/* Active indicator background glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-transparent blur-sm" />
                )}

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className={cn(
                  'relative rounded-lg p-2 transition-all duration-300',
                  isActive
                    ? 'bg-accent-200/50 dark:bg-accent-800/30 shadow-inner'
                    : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/20'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-all duration-300',
                    'group-hover:scale-125 group-hover:rotate-6',
                    isActive && 'drop-shadow-md'
                  )} />
                </div>

                {!isCollapsed && (
                  <span className="relative truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all duration-300 shadow-2xl z-50 border border-neutral-700 dark:border-neutral-300">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-3 h-3 rotate-45 bg-neutral-900 dark:bg-white border-l border-b border-neutral-700 dark:border-neutral-300"></div>
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
        className="lg:hidden fixed top-[4.5rem] left-4 z-50 p-2.5 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all touch-manipulation"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
        ) : (
          <Menu className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
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
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Menu */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-neutral-900 border-r-2 border-neutral-200 dark:border-neutral-800 z-50 shadow-2xl"
            >
              {/* Mobile Menu Header */}
              <div className="p-4 border-b-2 border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">LodgeIQ</h2>
                      <p className="text-xs text-white/80">Menu</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-accent-100 via-accent-50 to-accent-100/50 dark:from-accent-900/50 dark:via-accent-900/30 dark:to-accent-900/10 text-accent-700 dark:text-accent-300 shadow-md border-l-4 border-accent-600 dark:border-accent-500'
                          : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
                      )}
                    >
                      <div className={cn(
                        'rounded-lg p-2',
                        isActive
                          ? 'bg-accent-200/50 dark:bg-accent-800/30'
                          : 'bg-neutral-100 dark:bg-neutral-800'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer with Theme Toggle and User Info */}
              <div className="border-t-2 border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>

                {/* User Info */}
                {user && (
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-accent-100 dark:bg-accent-900/50 rounded-full p-2">
                        <UserIcon className="w-5 h-5 text-accent-700 dark:text-accent-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {user.name || user.email}
                        </p>
                        {user.name && user.email && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        // Sign out functionality would go here
                        window.location.href = '/api/auth/signout'
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
