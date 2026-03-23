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
import { useState, useEffect, useRef, type MouseEvent } from 'react'
import Link from 'next/link'
import { AnimatedCounter } from './animated-counter'

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
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-accent-100 dark:bg-accent-500/25',
    iconColor: 'text-accent-600 dark:text-accent-400',
    border: 'border-neutral-200 dark:border-neutral-800',
    accentBar: 'from-accent-500 to-accent-400',
  },
  success: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-accent-100 dark:bg-accent-500/25',
    iconColor: 'text-accent-600 dark:text-accent-400',
    border: 'border-accent-200 dark:border-accent-800/50',
    accentBar: 'from-accent-500 to-accent-400',
  },
  warning: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-amber-100 dark:bg-amber-500/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    accentBar: 'from-amber-500 to-amber-400',
  },
  danger: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-danger-100 dark:bg-danger-500/25',
    iconColor: 'text-danger-600 dark:text-danger-400',
    border: 'border-danger-200 dark:border-danger-800/50',
    accentBar: 'from-danger-500 to-danger-400',
  },
  primary: {
    bg: 'bg-white dark:bg-neutral-900',
    iconBg: 'bg-accent-100 dark:bg-accent-500/25',
    iconColor: 'text-accent-600 dark:text-accent-400',
    border: 'border-neutral-200 dark:border-neutral-800',
    accentBar: 'from-accent-500 to-accent-400',
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
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState({})

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 3D tilt effect handlers
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({})
  }

  // Parse numeric value for animation
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const isNumeric = !isNaN(numericValue)
  const decimals = typeof value === 'string' && value.includes('.') ? (value.split('.')[1]?.length || 0) : 0

  // Determine trend direction if not specified
  const trendDirection = trend?.direction || (trend && trend.value > 0 ? 'up' : trend && trend.value < 0 ? 'down' : 'neutral')

  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus

  const trendColor =
    trendDirection === 'up'
      ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/20'
      : trendDirection === 'down'
      ? 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/20'
      : 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800'

  const CardContent = (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => !href && setIsExpanded(!isExpanded)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={cn(
        'group relative rounded-xl border overflow-hidden',
        styles.bg,
        'shadow-sm hover:shadow-md',
        'transition-all duration-200 touch-manipulation',
        href ? 'cursor-pointer' : 'cursor-pointer sm:cursor-default',
        styles.border,
        'hover:border-accent-300 dark:hover:border-accent-600',
        className
      )}
    >
      {/* Top accent line with gradient */}
      <div className={cn('h-1 bg-gradient-to-r', styles.accentBar)} />

      <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className={cn(
                'rounded-lg p-2.5 transition-all duration-300',
                'group-hover:shadow-md group-hover:scale-110',
                styles.iconBg
              )}
            >
              <Icon className={cn('w-5 h-5 transition-colors duration-300', styles.iconColor)} />
            </motion.div>

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
          <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
            {isNumeric ? (
              <AnimatedCounter
                value={numericValue}
                decimals={decimals}
                duration={1200}
              />
            ) : (
              value
            )}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 tracking-wide">
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
            <p className="text-xs text-neutral-500 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
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
