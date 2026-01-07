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
    iconBg: 'bg-neutral-100 dark:bg-neutral-800/50',
    iconColor: 'text-neutral-600 dark:text-neutral-400',
    border: 'border-stone-200 dark:border-neutral-700',
    accentBar: 'bg-neutral-300',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-50/50 to-white dark:bg-neutral-900',
    iconBg: 'bg-emerald-100 dark:bg-success-950/20',
    iconColor: 'text-emerald-600 dark:text-success-500',
    border: 'border-emerald-200/60 dark:border-neutral-700',
    accentBar: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-50/50 to-white dark:bg-neutral-900',
    iconBg: 'bg-amber-100 dark:bg-warning-950/20',
    iconColor: 'text-amber-600 dark:text-warning-500',
    border: 'border-amber-200/60 dark:border-neutral-700',
    accentBar: 'bg-gradient-to-r from-amber-500 to-amber-600',
  },
  danger: {
    bg: 'bg-gradient-to-br from-red-50/50 to-white dark:bg-neutral-900',
    iconBg: 'bg-red-100 dark:bg-danger-950/20',
    iconColor: 'text-red-600 dark:text-danger-500',
    border: 'border-red-200/60 dark:border-neutral-700',
    accentBar: 'bg-gradient-to-r from-red-500 to-red-600',
  },
  primary: {
    bg: 'bg-gradient-to-br from-accent-50/50 to-white dark:bg-neutral-900',
    iconBg: 'bg-accent-100 dark:bg-accent-950/20',
    iconColor: 'text-accent-600 dark:text-accent-500',
    border: 'border-accent-200/60 dark:border-neutral-700',
    accentBar: 'bg-gradient-to-r from-accent-500 to-accent-600',
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
        'group relative rounded-xl border overflow-hidden transition-all shadow-sm hover:shadow-lg',
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Top accent bar */}
      <div className={cn('h-1.5', styles.accentBar)} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-lg p-2.5 shadow-sm', styles.iconBg)}>
              <Icon className={cn('w-5 h-5', styles.iconColor)} />
            </div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-400">
              {title}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm',
                  trendColor
                )}
              >
                <TrendIcon className="w-3.5 h-3.5" />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {(subtitle || trend?.label) && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
              {subtitle || trend?.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
