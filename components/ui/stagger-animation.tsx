'use client'

import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 15,
    },
  },
}

const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Staggered container for lists/grids
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  delay = 0.1,
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual animated item
interface StaggerItemProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'fadeUp' | 'scaleIn' | 'slideIn'
}

export function StaggerItem({
  children,
  className,
  variant = 'default',
}: StaggerItemProps) {
  const variants = {
    default: itemVariants,
    fadeUp: fadeUpVariants,
    scaleIn: scaleInVariants,
    slideIn: slideInVariants,
  }

  return (
    <motion.div variants={variants[variant]} className={className}>
      {children}
    </motion.div>
  )
}

// Scroll-triggered animation wrapper
interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// List with staggered children animation
interface AnimatedListProps {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  variant?: 'default' | 'fadeUp' | 'scaleIn' | 'slideIn'
  as?: 'ul' | 'ol' | 'div'
}

export function AnimatedList({
  items,
  className,
  itemClassName,
  variant = 'default',
  as: Component = 'div',
}: AnimatedListProps) {
  const variants = {
    default: itemVariants,
    fadeUp: fadeUpVariants,
    scaleIn: scaleInVariants,
    slideIn: slideInVariants,
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={variants[variant]}
          className={itemClassName}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Grid with staggered card animations
interface AnimatedGridProps {
  children: ReactNode
  className?: string
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

const gridColumns = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const gridGaps = {
  sm: 'gap-3',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
}

export function AnimatedGrid({
  children,
  className,
  columns = 4,
  gap = 'md',
}: AnimatedGridProps) {
  return (
    <StaggerContainer
      className={cn('grid', gridColumns[columns], gridGaps[gap], className)}
    >
      {children}
    </StaggerContainer>
  )
}

// Card entrance animation
export function AnimatedCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hover lift animation wrapper
export function HoverLift({
  children,
  className,
  amount = 4,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      whileHover={{ y: -amount }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
