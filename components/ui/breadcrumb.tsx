/**
 * Breadcrumb Navigation Component
 *
 * Shows hierarchical navigation path with clickable links
 */

'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <motion.nav
      aria-label="Breadcrumb"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 sm:mb-6"
    >
      <ol className="flex items-center gap-1.5 sm:gap-2 text-sm flex-wrap">
        {/* Home link */}
        <motion.li
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            className="group flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-all"
          >
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
          </Link>
        </motion.li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
              {isLast ? (
                <span className="px-2.5 py-1 font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="px-2.5 py-1 text-neutral-600 dark:text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-all"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </motion.nav>
  )
}
