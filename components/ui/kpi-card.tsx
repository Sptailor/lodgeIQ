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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow',
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Top accent bar */}
      <div className={cn('h-1', styles.accentBar)} />

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className={cn('rounded-lg p-2', styles.iconBg)}>
            <Icon className={cn('w-5 h-5', styles.iconColor)} />
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                trendColor
              )}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
            {value}
          </h3>
        </div>

        {(subtitle || trend?.label) && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {subtitle || trend?.label}
          </p>
        )}
      </div>
    </motion.div>
  )
}
