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
    bg: 'bg-white/5',
    iconBg: 'bg-white/10',
    iconColor: 'text-white',
    border: 'border-white/10',
    accentBar: 'from-primary-500 to-accent-500',
    glow: 'shadow-glow',
  },
  success: {
    bg: 'bg-white/5',
    iconBg: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
    border: 'border-teal-500/20',
    accentBar: 'from-teal-500 to-teal-400',
    glow: 'shadow-glow-teal',
  },
  warning: {
    bg: 'bg-white/5',
    iconBg: 'bg-warning-500/20',
    iconColor: 'text-warning-400',
    border: 'border-warning-500/20',
    accentBar: 'from-warning-500 to-warning-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
  danger: {
    bg: 'bg-white/5',
    iconBg: 'bg-danger-500/20',
    iconColor: 'text-danger-400',
    border: 'border-danger-500/20',
    accentBar: 'from-danger-500 to-danger-400',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  primary: {
    bg: 'bg-white/5',
    iconBg: 'bg-primary-500/20',
    iconColor: 'text-primary-400',
    border: 'border-primary-500/20',
    accentBar: 'from-primary-500 to-primary-400',
    glow: 'shadow-glow',
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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => !href && setIsExpanded(!isExpanded)}
      className={cn(
        'group relative rounded-2xl border overflow-hidden',
        'bg-white/8 backdrop-blur-xl',
        'shadow-glass',
        'hover:bg-white/12 hover:border-white/20',
        'transition-all duration-300 touch-manipulation',
        href ? 'cursor-pointer' : 'cursor-pointer sm:cursor-default',
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

      <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with floating animation */}
            <motion.div
              whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
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

            {/* Mobile expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden"
            >
              <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
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

        <div className="space-y-1.5 sm:space-y-2">
          <motion.h3
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-bold text-white"
          >
            {value}
          </motion.h3>
          <p className="text-[11px] sm:text-sm font-semibold text-white/60 tracking-wide uppercase">
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
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
              <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 font-medium text-center">
                {subtitle || trend?.label}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Corner accent decoration */}
      <div className={cn(
        'absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10',
        styles.accentBar
      )} />
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{CardContent}</Link>
  }

  return CardContent
}
