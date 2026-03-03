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
          'rounded-lg bg-white dark:bg-primary-800',
          'border border-primary-200 dark:border-primary-600',
          'hover:border-accent-400 dark:hover:border-accent-500',
          'shadow-md hover:shadow-lg',
          'group',
          !isCollapsed && 'pointer-events-none'
        )}
        title="Expand sidebar"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Menu icon */}
        <div className="flex flex-col gap-1.5 w-5">
          <div className="h-0.5 w-full bg-primary-500 dark:bg-primary-400 rounded-full group-hover:bg-accent-500 transition-colors" />
          <div className="h-0.5 w-full bg-primary-500 dark:bg-primary-400 rounded-full group-hover:bg-accent-500 transition-colors" />
          <div className="h-0.5 w-full bg-primary-500 dark:bg-primary-400 rounded-full group-hover:bg-accent-500 transition-colors" />
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
        className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-primary-900/95 backdrop-blur-xl border-r border-primary-200 dark:border-primary-700 z-40 shadow-sm"
      >
        {/* Close Button */}
        <div className="p-4 border-b border-primary-200 dark:border-primary-700">
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all group bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 border border-primary-200 dark:border-primary-600"
            title="Collapse sidebar"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-300 group-hover:text-primary-900 dark:group-hover:text-white transition-colors">
              Menu
            </span>

            {/* Close icon (X) */}
            <div className="relative w-5 h-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-primary-400 dark:bg-primary-500 rounded-full rotate-45 group-hover:bg-accent-500 transition-colors" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-primary-400 dark:bg-primary-500 rounded-full -rotate-45 group-hover:bg-accent-500 transition-colors" />
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400'
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-900 dark:hover:text-white'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-500 rounded-r-full" />
                )}

                <div className={cn(
                  'rounded-lg p-2 transition-all duration-200',
                  isActive
                    ? 'bg-accent-100 dark:bg-accent-500/20'
                    : 'bg-primary-100 dark:bg-primary-800 group-hover:bg-primary-200 dark:group-hover:bg-primary-700'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-accent-600 dark:text-accent-400' : 'text-primary-500 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-white'
                  )} />
                </div>

                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-primary-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 shadow-lg z-50">
                    {item.label}
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
        className={`lg:hidden fixed top-4 left-2 p-2.5 rounded-lg bg-white/90 dark:bg-primary-800/90 backdrop-blur-md border border-primary-200 dark:border-primary-600 shadow-sm hover:bg-primary-50 dark:hover:bg-primary-700 transition-all duration-200 touch-manipulation ${mobileMenuOpen ? 'z-[80]' : 'z-[60]'}`}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-primary-700 dark:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-primary-700 dark:text-white" />
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
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white dark:bg-primary-900 border-r border-primary-200 dark:border-primary-700 z-[70] shadow-lg"
            >
              {/* Mobile Navigation Items */}
              <nav className="flex-1 pt-16 pb-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/')

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                        isActive
                          ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400'
                          : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-500 rounded-r-full" />
                      )}
                      <div className={cn(
                        'rounded-lg p-2',
                        isActive
                          ? 'bg-accent-100 dark:bg-accent-500/20'
                          : 'bg-primary-100 dark:bg-primary-800'
                      )}>
                        <Icon className={cn('w-5 h-5', isActive ? 'text-accent-600 dark:text-accent-400' : 'text-primary-500 dark:text-primary-400')} />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer with Theme Toggle and User Info */}
              <div className="border-t border-primary-200 dark:border-primary-700 p-4 space-y-3">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>

                {/* User Info */}
                {user && (
                  <div className="pt-3 border-t border-primary-200 dark:border-primary-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-accent-100 dark:bg-accent-500/20 rounded-full p-2">
                        <UserIcon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary-900 dark:text-white truncate">
                          {user.name || user.email}
                        </p>
                        {user.name && user.email && (
                          <p className="text-xs text-primary-500 dark:text-primary-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        window.location.href = '/api/auth/signout'
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-500/20 transition-colors border border-danger-200 dark:border-danger-500/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
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
