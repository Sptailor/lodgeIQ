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
    iconColor: 'text-neutral-600 dark:text-neutral-400',
    border: 'border-neutral-200 dark:border-neutral-800',
  },
  success: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-success-100 dark:bg-success-950/20',
    iconColor: 'text-success-600 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800',
  },
  warning: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-warning-100 dark:bg-warning-950/20',
    iconColor: 'text-warning-600 dark:text-warning-400',
    border: 'border-warning-200 dark:border-warning-800',
  },
  danger: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-danger-100 dark:bg-danger-950/20',
    iconColor: 'text-danger-600 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800',
  },
  primary: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-primary-100 dark:bg-primary-950/20',
    iconColor: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-200 dark:border-primary-800',
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
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border-2 p-6 shadow-soft hover:shadow-soft-lg transition-all',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold',
                  trendColor
                )}
              >
                <TrendIcon className="w-3 h-3" />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Icon */}
        <div className={cn('rounded-xl p-3', styles.iconBg)}>
          <Icon className={cn('w-6 h-6', styles.iconColor)} />
        </div>
      </div>

      {/* Subtitle or trend label */}
      {(subtitle || trend?.label) && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {subtitle || trend?.label}
        </p>
      )}
    </motion.div>
  )
}
