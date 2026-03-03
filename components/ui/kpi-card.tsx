/**
 * KPI Card Component
 *
 * Professional metric display cards for dashboard
 * Shows key performance indicators with trends and comparisons
 * Based on industry research of hotel PMS dashboards
 */

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Building2, ClipboardCheck, CheckCircle2, TrendingUp as TrendingUpIcon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  href?: string
}

const iconMap = {
  'building': Building2,
  'clipboard': ClipboardCheck,
  'check-circle': CheckCircle2,
  'trending-up': TrendingUpIcon,
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-primary-800/50',
    iconBg: 'bg-accent-100 dark:bg-accent-500/20',
    iconColor: 'text-accent-600 dark:text-accent-400',
    border: 'border-primary-200 dark:border-primary-700',
    accentBar: 'from-accent-500 to-accent-400',
  },
  success: {
    bg: 'bg-white dark:bg-primary-800/50',
    iconBg: 'bg-teal-100 dark:bg-teal-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-500/30',
    accentBar: 'from-teal-500 to-teal-400',
  },
  warning: {
    bg: 'bg-white dark:bg-primary-800/50',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-500/30',
    accentBar: 'from-amber-500 to-amber-400',
  },
  danger: {
    bg: 'bg-white dark:bg-primary-800/50',
    iconBg: 'bg-danger-100 dark:bg-danger-500/20',
    iconColor: 'text-danger-600 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-500/30',
    accentBar: 'from-danger-500 to-danger-400',
  },
  primary: {
    bg: 'bg-white dark:bg-primary-800/50',
    iconBg: 'bg-primary-100 dark:bg-primary-500/20',
    iconColor: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-200 dark:border-primary-600',
    accentBar: 'from-primary-600 to-primary-500',
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
  href,
}: KPICardProps) {
  const styles = variantStyles[variant]
  const Icon = iconMap[icon]
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Determine trend direction if not specified
  const trendDirection = trend?.direction || (trend && trend.value > 0 ? 'up' : trend && trend.value < 0 ? 'down' : 'neutral')

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus

  const trendColor =
    trendDirection === 'up'
      ? 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/20'
      : trendDirection === 'down'
      ? 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/20'
      : 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800'

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => !href && setIsExpanded(!isExpanded)}
      className={cn(
        'group relative rounded-xl border overflow-hidden',
        styles.bg,
        'shadow-sm hover:shadow-md',
        'transition-all duration-200 touch-manipulation',
        href ? 'cursor-pointer' : 'cursor-pointer sm:cursor-default',
        styles.border,
        className
      )}
    >

      {/* Top accent line with gradient */}
      <div className={cn('h-1 bg-gradient-to-r', styles.accentBar)} />

      <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={cn(
                'rounded-lg p-2.5',
                styles.iconBg
              )}
            >
              <Icon className={cn('w-5 h-5', styles.iconColor)} />
            </div>

            {/* Mobile expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden"
            >
              <ChevronDown className="w-4 h-4 text-primary-400" />
            </motion.div>
          </div>

          {/* Trend indicator with pulse animation */}
          {trend && (isExpanded || !isMobile) && (
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

        <div className="space-y-1">
          <h3 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-white">
            {value}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-primary-500 dark:text-primary-400 tracking-wide">
            {title}
          </p>
        </div>

        {(subtitle || trend?.label) && (
          <motion.div
            initial={false}
            animate={{
              height: isExpanded || !isMobile ? 'auto' : 0,
              opacity: isExpanded || !isMobile ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-primary-400 dark:text-primary-500 pt-2 border-t border-primary-100 dark:border-primary-700">
              {subtitle || trend?.label}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{CardContent}</Link>
  }

  return CardContent
}
