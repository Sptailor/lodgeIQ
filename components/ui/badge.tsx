'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
  icon?: ReactNode
  removable?: boolean
  onRemove?: () => void
  className?: string
}

const variantStyles = {
  default: {
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-700 dark:text-neutral-300',
    dot: 'bg-neutral-500',
    border: 'border-transparent',
  },
  success: {
    bg: 'bg-accent-50 dark:bg-accent-900/30',
    text: 'text-accent-700 dark:text-accent-300',
    dot: 'bg-accent-500',
    border: 'border-transparent',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    border: 'border-transparent',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    border: 'border-transparent',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    border: 'border-transparent',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-neutral-700 dark:text-neutral-300',
    dot: 'bg-neutral-500',
    border: 'border-neutral-300 dark:border-neutral-600',
  },
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  icon,
  removable = false,
  onRemove,
  className,
}: BadgeProps) {
  const styles = variantStyles[variant]

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        'transition-all duration-200',
        styles.bg,
        styles.text,
        styles.border,
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                styles.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', styles.dot)} />
        </span>
      )}

      {icon && <span className="flex-shrink-0">{icon}</span>}

      {children}

      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            'ml-0.5 -mr-1 p-0.5 rounded-full transition-colors',
            'hover:bg-neutral-200 dark:hover:bg-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-500'
          )}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </motion.span>
  )
}

// Count badge for notifications
interface CountBadgeProps {
  count: number
  max?: number
  variant?: 'default' | 'success' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function CountBadge({
  count,
  max = 99,
  variant = 'danger',
  size = 'sm',
  className,
}: CountBadgeProps) {
  if (count === 0) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  const variantColors = {
    default: 'bg-neutral-500 text-white',
    success: 'bg-accent-500 text-white',
    danger: 'bg-red-500 text-white',
  }

  const sizeClasses = {
    sm: 'min-w-4 h-4 text-[10px] px-1',
    md: 'min-w-5 h-5 text-xs px-1.5',
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-full',
        variantColors[variant],
        sizeClasses[size],
        className
      )}
    >
      {displayCount}
    </motion.span>
  )
}

// Status dot indicator
interface StatusDotProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
}

export function StatusDot({ status, size = 'md', pulse = false, className }: StatusDotProps) {
  const statusColors = {
    online: 'bg-accent-500',
    offline: 'bg-neutral-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  }

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }

  return (
    <span className={cn('relative inline-flex', className)}>
      {pulse && status === 'online' && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            statusColors[status]
          )}
        />
      )}
      <span className={cn('relative inline-flex rounded-full', statusColors[status], sizeClasses[size])} />
    </span>
  )
}
