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
    iconBg: 'bg-neutral-50 dark:bg-neutral-800/50',
    iconColor: 'text-neutral-600 dark:text-neutral-400',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  success: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-success-50 dark:bg-success-950/20',
    iconColor: 'text-success-600 dark:text-success-500',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  warning: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-warning-50 dark:bg-warning-950/20',
    iconColor: 'text-warning-600 dark:text-warning-500',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  danger: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-danger-50 dark:bg-danger-950/20',
    iconColor: 'text-danger-600 dark:text-danger-500',
    border: 'border-neutral-200 dark:border-neutral-700',
  },
  primary: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-accent-50 dark:bg-accent-950/20',
    iconColor: 'text-accent-600 dark:text-accent-500',
    border: 'border-neutral-200 dark:border-neutral-700',
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
        'group relative rounded-lg border bg-white dark:bg-neutral-900 p-6 transition-all hover:border-neutral-300 dark:hover:border-neutral-700',
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className={cn('rounded-md p-2', styles.iconBg)}>
              <Icon className={cn('w-4 h-4', styles.iconColor)} />
            </div>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {title}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
                  trendColor
                )}
              >
                <TrendIcon className="w-3.5 h-3.5" />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {(subtitle || trend?.label) && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {subtitle || trend?.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
