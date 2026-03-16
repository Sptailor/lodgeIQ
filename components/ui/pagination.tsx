'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisiblePages?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: {
    button: 'h-7 min-w-7 text-xs',
    icon: 'w-3.5 h-3.5',
    gap: 'gap-1',
  },
  md: {
    button: 'h-9 min-w-9 text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5',
  },
  lg: {
    button: 'h-11 min-w-11 text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2',
  },
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
  size = 'md',
  className,
}: PaginationProps) {
  const styles = sizeStyles[size]

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pages.push(1)

    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    // Adjust if we're near the start
    if (currentPage <= 3) {
      end = Math.min(maxVisiblePages - 1, totalPages - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - maxVisiblePages + 2)
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  const PageButton = ({ page, isActive }: { page: number; isActive: boolean }) => (
    <motion.button
      onClick={() => onPageChange(page)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        styles.button,
        isActive
          ? 'bg-accent-500 text-white shadow-md shadow-accent-500/25'
          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-accent-300 dark:hover:border-accent-600 hover:text-accent-600 dark:hover:text-accent-400'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activePage"
          className="absolute inset-0 bg-accent-500 rounded-lg"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </motion.button>
  )

  const NavButton = ({
    onClick,
    disabled,
    children,
    'aria-label': ariaLabel,
  }: {
    onClick: () => void
    disabled: boolean
    children: React.ReactNode
    'aria-label': string
  }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200',
        styles.button,
        disabled
          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-accent-300 dark:hover:border-accent-600 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20'
      )}
    >
      {children}
    </motion.button>
  )

  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center', styles.gap, className)}
    >
      {/* First page */}
      {showFirstLast && (
        <NavButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft className={styles.icon} />
        </NavButton>
      )}

      {/* Previous page */}
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className={styles.icon} />
      </NavButton>

      {/* Page numbers */}
      <div className={cn('flex items-center', styles.gap)}>
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className={cn(
                'flex items-center justify-center text-neutral-400 dark:text-neutral-500',
                styles.button
              )}
            >
              ...
            </span>
          ) : (
            <PageButton key={page} page={page} isActive={currentPage === page} />
          )
        )}
      </div>

      {/* Next page */}
      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className={styles.icon} />
      </NavButton>

      {/* Last page */}
      {showFirstLast && (
        <NavButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight className={styles.icon} />
        </NavButton>
      )}
    </nav>
  )
}

// Compact pagination info display
export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: {
  currentPage: number
  pageSize: number
  totalItems: number
  className?: string
}) {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <p className={cn('text-sm text-neutral-600 dark:text-neutral-400', className)}>
      Showing <span className="font-medium text-neutral-900 dark:text-white">{start}</span> to{' '}
      <span className="font-medium text-neutral-900 dark:text-white">{end}</span> of{' '}
      <span className="font-medium text-neutral-900 dark:text-white">{totalItems}</span> results
    </p>
  )
}
