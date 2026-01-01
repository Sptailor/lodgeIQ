/**
 * Mobile Navigation Component
 *
 * Hamburger menu with slide-in drawer for mobile devices
 * Smooth animations and user info display
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        ) : (
          <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-soft-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-2 shadow-soft">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  LodgeIQ
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-tertiary-500 flex items-center justify-center shadow-soft">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-white dark:border-neutral-900 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Hotels</span>
              </Link>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Inspections</span>
              </Link>
            </nav>

            {/* Footer actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-danger-50 dark:hover:bg-danger-950/20 transition-colors text-danger-600 dark:text-danger-400">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
