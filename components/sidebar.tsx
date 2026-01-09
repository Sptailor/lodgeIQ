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
import { useSidebar } from '@/components/layout-wrapper'

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

  return (
    <>
      {/* Fixed Logo Header - Always visible, never collapses */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-16 z-50 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-800 dark:to-accent-900 border-b border-accent-700 dark:border-accent-900">
        <div className="h-full flex items-center px-6">
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
        </div>
      </div>

      {/* Collapsible Navigation Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 z-40 shadow-xl',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Collapse Toggle at Top */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium group',
              'bg-neutral-50 dark:bg-neutral-800/50 hover:bg-accent-50 dark:hover:bg-accent-900/20',
              'text-neutral-700 dark:text-neutral-300 hover:text-accent-700 dark:hover:text-accent-400',
              'border border-neutral-200 dark:border-neutral-700 hover:border-accent-300 dark:hover:border-accent-700',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {!isCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wide">Menu</span>
            )}
            <ChevronLeft
              className={cn(
                'w-4 h-4 transition-transform duration-300',
                isCollapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all relative group',
                  isActive
                    ? 'bg-gradient-to-r from-accent-100 to-accent-50 dark:from-accent-900/40 dark:to-accent-900/20 text-accent-700 dark:text-accent-300 shadow-sm'
                    : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200',
                  isActive && 'border-l-2 border-accent-600 dark:border-accent-500 pl-2.5'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-transform',
                  'group-hover:scale-110'
                )} />

                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-neutral-900 dark:bg-white"></div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-40 safe-area-pb shadow-xl">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 min-w-0 flex-1 relative transition-colors',
                  isActive
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-neutral-600 dark:text-neutral-400'
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent-600 rounded-b-full" />
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
