'use client'

/**
 * Skeleton Loader Component
 *
 * Animated placeholder for loading states
 * Provides smooth shimmer effect for professional UX
 */

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'shimmer' | 'none'
  style?: React.CSSProperties
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  style,
}: SkeletonProps) {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-700'

  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    none: '',
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  )
}

// Preset skeleton components for common use cases
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden p-5 sm:p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-lg',
      className
    )}>
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600" />
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="default" className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-lg" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                'h-4 flex-1',
                colIndex === 0 && 'w-1/4 flex-none'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonKPICard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden p-5 sm:p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-lg',
      className
    )}>
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600" />
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-28 mb-2 rounded-lg" />
      <Skeleton className="h-4 w-36 rounded-lg" />
    </div>
  )
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden p-5 sm:p-7 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-lg',
      className
    )}>
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600" />
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-4 w-28 rounded-lg" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// Page header skeleton
export function SkeletonPageHeader({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden p-5 sm:p-7 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-lg',
      className
    )}>
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-5 w-48 rounded-lg" />
        </div>
        <Skeleton className="w-32 h-20 rounded-xl" />
      </div>
    </div>
  )
}

// Hotel card skeleton
export function SkeletonHotelCard({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl shadow-lg',
      className
    )}>
      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 dark:from-neutral-600 dark:via-neutral-500 dark:to-neutral-600" />
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-4 w-full rounded-lg mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Inspection list item skeleton
export function SkeletonInspectionItem({ className }: { className?: string }) {
  return (
    <div className={cn(
      'relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-2 border-white/20 dark:border-neutral-700/50 rounded-xl p-4',
      className
    )}>
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neutral-300 to-neutral-400 dark:from-neutral-600 dark:to-neutral-500" />
      <div className="flex justify-between items-start gap-4 pl-3">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-5 w-40 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
