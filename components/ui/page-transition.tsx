'use client'

/**
 * Page Transition Component
 *
 * Smooth page transition wrapper using Framer Motion
 * Provides consistent entrance animations across the app
 */

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'scale' | 'none'
  delay?: number
  duration?: number
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  'slide-left': {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
}

export function PageTransition({
  children,
  className,
  variant = 'slide-up',
  delay = 0,
  duration = 0.3,
}: PageTransitionProps) {
  const selectedVariant = variants[variant]

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animations
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: initialDelay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Fade in on scroll (intersection observer based)
interface FadeInOnScrollProps {
  children: ReactNode
  className?: string
  threshold?: number
  delay?: number
}

export function FadeInOnScroll({
  children,
  className,
  threshold = 0.1,
  delay = 0,
}: FadeInOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Section wrapper with entrance animation
interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  title,
  description,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn('space-y-4', className)}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 }}
              className="text-xl font-semibold text-neutral-900 dark:text-white"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              {description}
            </motion.p>
          )}
        </div>
      )}
      {children}
    </motion.section>
  )
}

// Grid with staggered children
interface AnimatedGridProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function AnimatedGrid({
  children,
  className,
  columns = 3,
}: AnimatedGridProps) {
  return (
    <StaggerContainer
      className={cn('grid gap-4', gridColumns[columns], className)}
      staggerDelay={0.05}
    >
      {children}
    </StaggerContainer>
  )
}

export function AnimatedGridItem({ children, className }: StaggerItemProps) {
  return <StaggerItem className={className}>{children}</StaggerItem>
}

// Hero section with gradient text animation
interface AnimatedHeroProps {
  children: ReactNode
  className?: string
}

export function AnimatedHero({ children, className }: AnimatedHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Card hover animation wrapper
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in from side
interface SlideInProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right'
  delay?: number
}

export function SlideIn({ children, className, direction = 'left', delay = 0 }: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation
interface ScaleInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Number counter animation
interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 1 }: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration }}
      >
        {value}
      </motion.span>
    </motion.span>
  )
}
