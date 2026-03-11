'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'teal' | 'sunset' | 'ocean'
  animate?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p'
}

const gradientVariants = {
  default: 'from-accent-600 via-accent-500 to-teal-500',
  accent: 'from-accent-500 to-accent-700',
  teal: 'from-teal-400 via-teal-500 to-accent-500',
  sunset: 'from-amber-500 via-orange-500 to-rose-500',
  ocean: 'from-blue-400 via-teal-500 to-emerald-500',
}

export function GradientText({
  children,
  className,
  variant = 'default',
  animate = false,
  as: Component = 'span',
}: GradientTextProps) {
  const baseClasses = cn(
    'bg-gradient-to-r bg-clip-text text-transparent',
    gradientVariants[variant],
    animate && 'animate-gradient-shift bg-[length:200%_auto]',
    className
  )

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        {children}
      </motion.span>
    )
  }

  return <Component className={baseClasses}>{children}</Component>
}

// Page header with gradient accent and animated underline
interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  gradient?: boolean
  variant?: 'default' | 'accent' | 'teal' | 'sunset' | 'ocean'
  badge?: ReactNode
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  className,
  gradient = true,
  variant = 'default',
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white"
            >
              {gradient ? (
                <GradientText variant={variant}>{title}</GradientText>
              ) : (
                title
              )}
            </motion.h1>
            {badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {badge}
              </motion.div>
            )}
          </div>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl"
            >
              {description}
            </motion.p>
          )}

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'h-1 w-20 rounded-full bg-gradient-to-r mt-3',
              gradientVariants[variant]
            )}
          />
        </div>

        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Split color heading - first half one color, second half gradient
export function SplitHeading({
  firstPart,
  secondPart,
  className,
  variant = 'default',
}: {
  firstPart: string
  secondPart: string
  className?: string
  variant?: 'default' | 'accent' | 'teal' | 'sunset' | 'ocean'
}) {
  return (
    <h1 className={cn('text-2xl sm:text-3xl md:text-4xl font-bold', className)}>
      <span className="text-neutral-900 dark:text-white">{firstPart} </span>
      <GradientText variant={variant}>{secondPart}</GradientText>
    </h1>
  )
}

// Outlined text effect
export function OutlinedText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'text-transparent bg-clip-text',
        'bg-gradient-to-r from-accent-500 to-teal-500',
        '[text-shadow:_-1px_-1px_0_currentColor,_1px_-1px_0_currentColor,_-1px_1px_0_currentColor,_1px_1px_0_currentColor]',
        className
      )}
      style={{
        WebkitTextStroke: '1px currentColor',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}
