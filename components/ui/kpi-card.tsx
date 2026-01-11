/**
 * KPI Card Component
 *
 * Professional metric display cards for dashboard
 * Shows key performance indicators with trends and comparisons
 * Based on industry research of hotel PMS dashboards
 */

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Building2, ClipboardCheck, CheckCircle2, TrendingUp as TrendingUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type IconName = 'building' | 'clipboard' | 'check-circle' | 'trending-up'

interface KPICardProps {
  title: string
  value: string | number
  icon: IconName
  trend?: {
    value: number
    label?: string
    direction?: 'up' | 'down' | 'neutral'
  }
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  className?: string
}

const iconMap = {
  'building': Building2,
  'clipboard': ClipboardCheck,
  'check-circle': CheckCircle2,
  'trending-up': TrendingUpIcon,
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    iconColor: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-200 dark:border-neutral-800',
    accentBar: 'bg-neutral-300 dark:bg-neutral-700',
  },
  success: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-success-100 dark:bg-success-900/30',
    iconColor: 'text-success-700 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800/40',
    accentBar: 'bg-success-500',
  },
  warning: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-700 dark:text-warning-400',
    border: 'border-warning-200 dark:border-warning-800/40',
    accentBar: 'bg-warning-500',
  },
  danger: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-danger-100 dark:bg-danger-900/30',
    iconColor: 'text-danger-700 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800/40',
    accentBar: 'bg-danger-500',
  },
  primary: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-accent-100 dark:bg-accent-900/30',
    iconColor: 'text-accent-700 dark:text-accent-400',
    border: 'border-accent-200 dark:border-accent-800/40',
    accentBar: 'bg-accent-600',
  },
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  subtitle,
  variant = 'default',
  className,
}: KPICardProps) {
  const styles = variantStyles[variant]
  const Icon = iconMap[icon]

  // Determine trend direction if not specified
  const trendDirection = trend?.direction || (trend && trend.value > 0 ? 'up' : trend && trend.value < 0 ? 'down' : 'neutral')

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus

  const trendColor =
    trendDirection === 'up'
      ? 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/20'
      : trendDirection === 'down'
      ? 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/20'
      : 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group relative rounded-xl sm:rounded-2xl border overflow-hidden backdrop-blur-md bg-white/80 dark:bg-neutral-900/80',
        'shadow-lg shadow-neutral-200/50 dark:shadow-neutral-950/50',
        'hover:shadow-xl sm:hover:shadow-2xl hover:shadow-accent-500/20 dark:hover:shadow-accent-500/10',
        'transition-all duration-300 touch-manipulation',
        styles.border,
        className
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn('absolute inset-0 bg-gradient-to-br', styles.accentBar, 'opacity-5')} />
      </div>

      {/* Glowing border effect on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'ring-1 ring-inset',
        styles.accentBar.replace('bg-', 'ring-')
      )} />

      {/* Top accent line with gradient */}
      <div className={cn('h-1 bg-gradient-to-r', styles.accentBar)} />

      <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          {/* Icon with floating animation */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'relative rounded-lg sm:rounded-xl p-2 sm:p-3',
              'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900',
              'shadow-md',
              styles.iconBg,
              'group-hover:shadow-lg transition-shadow duration-300'
            )}
          >
            <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', styles.iconColor)} />
            {/* Icon glow effect */}
            <div className={cn(
              'absolute inset-0 rounded-lg sm:rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300',
              styles.iconBg
            )} />
          </motion.div>

          {/* Trend indicator with pulse animation */}
          {trend && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold',
                'backdrop-blur-sm border',
                trendColor
              )}
            >
              <TrendIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs">{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </p>
          <motion.h3
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent"
          >
            {value}
          </motion.h3>
        </div>

        {(subtitle || trend?.label) && (
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium text-center">
              {subtitle || trend?.label}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
          </div>
        )}
      </div>

      {/* Corner accent decoration */}
      <div className={cn(
        'absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10',
        styles.accentBar
      )} />
    </motion.div>
  )
}
