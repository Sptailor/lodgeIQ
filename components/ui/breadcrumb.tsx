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
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        {/* Home link */}
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/"
            className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
          >
            <Home className="w-4 h-4" />
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
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
              {isLast ? (
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}
