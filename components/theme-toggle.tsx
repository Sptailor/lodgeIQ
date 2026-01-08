/**
 * Theme Toggle Component
 *
 * Interactive dark mode toggle with smooth animation
 * Sun/moon icon with visual feedback
 */

'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative group w-14 h-8 rounded-full transition-all duration-300',
        'bg-gradient-to-r from-accent-500 to-accent-600 dark:from-neutral-700 dark:to-neutral-800',
        'shadow-md hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-accent-400 dark:focus:ring-accent-600 focus:ring-offset-2',
        'border-2 border-white dark:border-neutral-900'
      )}
      aria-label="Toggle theme"
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300',
          'bg-white dark:bg-neutral-900 shadow-lg',
          'flex items-center justify-center',
          'dark:translate-x-6'
        )}
      >
        <Sun className="h-3.5 w-3.5 scale-100 transition-all dark:scale-0 text-accent-600" />
        <Moon className="absolute h-3.5 w-3.5 scale-0 transition-all dark:scale-100 text-accent-400" />
      </span>
    </button>
  )
}
