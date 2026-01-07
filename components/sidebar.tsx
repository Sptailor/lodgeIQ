/**
 * Sidebar Navigation Component
 *
 * Professional sidebar navigation for desktop with collapsible functionality
 * Bottom tab bar for mobile devices
 * Based on industry research of hotel PMS systems
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  ClipboardCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/30 dark:from-neutral-900 dark:to-neutral-950 border-r border-slate-200 dark:border-neutral-800 transition-all duration-300 z-40',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-accent-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-2.5 shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                  LodgeIQ
                </h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  Inspection Platform
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-2.5 shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group',
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-accent-600 dark:text-accent-400 shadow-sm border border-accent-100 dark:border-neutral-700'
                    : 'text-neutral-700 dark:text-neutral-400 hover:bg-white/70 dark:hover:bg-neutral-800/70 hover:text-accent-600 dark:hover:text-accent-400 border border-transparent'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-500 to-accent-600 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'ml-2')} />

                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-accent-100 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-400 hover:bg-accent-100 dark:hover:bg-neutral-800 hover:text-accent-600 dark:hover:text-accent-400 transition-all group"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className={cn(
              'flex items-center justify-center w-6 h-6 rounded-md bg-accent-100 dark:bg-neutral-800 group-hover:bg-accent-200 dark:group-hover:bg-neutral-700 transition-colors',
            )}>
              <ChevronLeft
                className={cn(
                  'w-4 h-4 transition-transform text-accent-600 dark:text-accent-400',
                  isCollapsed && 'rotate-180'
                )}
              />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t-2 border-accent-100 dark:border-neutral-800 z-40 safe-area-pb shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 min-w-0 flex-1 relative',
                  isActive
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-accent-500 to-accent-600 rounded-b-full" />
                )}
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
