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
          'hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-white to-primary-50/50 dark:from-neutral-900/98 dark:via-neutral-900/95 dark:to-neutral-950/95 dark:backdrop-blur-xl border-r border-accent-200/50 dark:border-accent-900/30 transition-all duration-300 z-40 shadow-soft-xl',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-accent-200/50 dark:border-accent-900/30 bg-gradient-to-r from-accent-600 via-accent-500 to-gold-600 dark:from-accent-800 dark:via-accent-700 dark:to-gold-800">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  LodgeIQ
                </h1>
                <p className="text-xs text-white/80 font-medium">
                  Inspection Platform
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group',
                  isActive
                    ? 'bg-gradient-to-r from-accent-100 to-accent-50 dark:from-accent-900/40 dark:to-accent-950/20 text-accent-800 dark:text-accent-200 shadow-soft ring-1 ring-accent-200/60 dark:ring-accent-800/30'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-100/60 dark:hover:bg-primary-900/20 hover:text-accent-700 dark:hover:text-accent-300'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />

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
        <div className="p-4 border-t border-accent-200/40 dark:border-accent-900/20">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-accent-700 dark:hover:text-accent-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-soft"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 transition-transform',
                isCollapsed && 'rotate-180'
              )}
            />
            {!isCollapsed && (
              <span className="text-sm">Collapse</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/98 dark:backdrop-blur-xl border-t-2 border-accent-200/60 dark:border-accent-900/30 z-40 safe-area-pb shadow-soft-xl">
        <div className="flex justify-around py-2.5">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-3 py-2 min-w-0 flex-1 relative rounded-xl transition-colors',
                  isActive
                    ? 'text-accent-700 dark:text-accent-200'
                    : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-accent-500 via-accent-600 to-gold-600 rounded-b-full shadow-soft" />
                )}
                <Icon className="w-6 h-6" />
                <span className="text-xs font-bold truncate w-full text-center">
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
