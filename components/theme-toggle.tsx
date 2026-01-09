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
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-16 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative group w-16 h-9 rounded-full transition-all duration-500 overflow-hidden backdrop-blur-md border-2 border-neutral-300 dark:border-neutral-600 hover:border-accent-400 dark:hover:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 dark:focus:ring-accent-600 focus:ring-offset-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-600"
        animate={{
          opacity: isDark ? 0.9 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000" />

      {/* Toggle circle with icon */}
      <motion.span
        className="absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Sun className="h-4 w-4 scale-100 dark:scale-0 absolute transition-all duration-300 text-amber-500" />
          <Moon className="h-4 w-4 scale-0 dark:scale-100 transition-all duration-300 text-indigo-500" />
        </motion.div>

        {/* Glow effect around icon */}
        <div className="absolute inset-0 rounded-full bg-amber-400 dark:bg-indigo-500 blur-md opacity-30" />
      </motion.span>
    </motion.button>
  )
}
