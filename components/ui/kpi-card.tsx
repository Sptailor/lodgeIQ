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
    bg: 'bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-800/50 dark:to-neutral-900/50 dark:backdrop-blur-xl',
    iconBg: 'bg-primary-100 dark:bg-primary-800/40 ring-1 ring-primary-200/50 dark:ring-primary-700/30',
    iconColor: 'text-primary-700 dark:text-primary-300',
    border: 'border-primary-200/70 dark:border-primary-800/40',
    accentBar: 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600',
  },
  success: {
    bg: 'bg-gradient-to-br from-white to-success-50/40 dark:from-success-950/30 dark:to-neutral-900/50 dark:backdrop-blur-xl',
    iconBg: 'bg-success-100 dark:bg-success-900/40 ring-1 ring-success-200/50 dark:ring-success-800/30',
    iconColor: 'text-success-700 dark:text-success-300',
    border: 'border-success-200/70 dark:border-success-800/40',
    accentBar: 'bg-gradient-to-r from-success-500 via-success-600 to-emerald-600',
  },
  warning: {
    bg: 'bg-gradient-to-br from-white to-gold-50/40 dark:from-gold-950/30 dark:to-neutral-900/50 dark:backdrop-blur-xl',
    iconBg: 'bg-gold-100 dark:bg-gold-900/40 ring-1 ring-gold-200/50 dark:ring-gold-800/30',
    iconColor: 'text-gold-700 dark:text-gold-300',
    border: 'border-gold-200/70 dark:border-gold-800/40',
    accentBar: 'bg-gradient-to-r from-gold-500 via-gold-600 to-warning-600',
  },
  danger: {
    bg: 'bg-gradient-to-br from-white to-danger-50/40 dark:from-danger-950/30 dark:to-neutral-900/50 dark:backdrop-blur-xl',
    iconBg: 'bg-danger-100 dark:bg-danger-900/40 ring-1 ring-danger-200/50 dark:ring-danger-800/30',
    iconColor: 'text-danger-700 dark:text-danger-300',
    border: 'border-danger-200/70 dark:border-danger-800/40',
    accentBar: 'bg-gradient-to-r from-danger-500 via-danger-600 to-red-600',
  },
  primary: {
    bg: 'bg-gradient-to-br from-white to-accent-50/50 dark:from-accent-950/40 dark:to-neutral-900/50 dark:backdrop-blur-xl',
    iconBg: 'bg-accent-100 dark:bg-accent-900/50 ring-1 ring-accent-200/60 dark:ring-accent-700/40',
    iconColor: 'text-accent-700 dark:text-accent-200',
    border: 'border-accent-200/80 dark:border-accent-700/50',
    accentBar: 'bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700',
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
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group relative rounded-lg border overflow-hidden transition-all duration-300 shadow-soft hover:shadow-soft-lg',
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Top accent bar with shimmer effect */}
      <div className={cn('h-2', styles.accentBar)} />

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3.5">
          <div className={cn('rounded-xl p-3 shadow-soft transition-transform group-hover:scale-105', styles.iconBg)}>
            <Icon className={cn('w-6 h-6', styles.iconColor)} />
          </div>
          <p className="text-sm font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
            {title}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-soft ring-1',
                  trendColor
                )}
              >
                <TrendIcon className="w-4 h-4" />
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          {(subtitle || trend?.label) && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-semibold leading-relaxed">
              {subtitle || trend?.label}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
