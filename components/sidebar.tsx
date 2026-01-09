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
      {/* Collapsible Navigation Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 z-40 shadow-xl',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Animated Hamburger Menu Toggle */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <label className={cn(
            'relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all group overflow-hidden',
            'bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-800/50',
            'hover:from-accent-50 hover:to-accent-100 dark:hover:from-accent-900/30 dark:hover:to-accent-900/10',
            'border-2 border-neutral-200 dark:border-neutral-700 hover:border-accent-400 dark:hover:border-accent-600',
            'shadow-sm hover:shadow-lg hover:shadow-accent-500/20 dark:hover:shadow-accent-500/10',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            {!isCollapsed && (
              <span className="relative text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 group-hover:text-accent-700 dark:group-hover:text-accent-400 transition-colors">
                Menu
              </span>
            )}

            {/* Hidden checkbox */}
            <input
              type="checkbox"
              className="peer hidden"
              checked={isCollapsed}
              onChange={(e) => setIsCollapsed(e.target.checked)}
            />

            {/* Animated hamburger icon */}
            <div className="relative flex flex-col gap-2 w-8">
              <div className={cn(
                'rounded-2xl h-[3px] w-1/2 bg-neutral-700 dark:bg-neutral-300 duration-500 origin-right transition-all',
                'group-hover:bg-accent-600 dark:group-hover:bg-accent-400',
                isCollapsed && 'rotate-[225deg] -translate-x-[12px] -translate-y-[1px]'
              )} />
              <div className={cn(
                'rounded-2xl h-[3px] w-full bg-neutral-700 dark:bg-neutral-300 duration-500 transition-all',
                'group-hover:bg-accent-600 dark:group-hover:bg-accent-400',
                isCollapsed && '-rotate-45'
              )} />
              <div className={cn(
                'rounded-2xl h-[3px] w-1/2 bg-neutral-700 dark:bg-neutral-300 duration-500 origin-left place-self-end transition-all',
                'group-hover:bg-accent-600 dark:group-hover:bg-accent-400',
                isCollapsed && 'rotate-[225deg] translate-x-[12px] translate-y-[1px]'
              )} />
            </div>
          </label>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

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
