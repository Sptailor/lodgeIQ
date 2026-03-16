'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode, type MouseEvent, useState, useRef } from 'react'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  hoverEffect?: 'lift' | 'glow' | 'border' | 'scale' | 'tilt' | 'none'
  pressEffect?: boolean
  disabled?: boolean
}

export function InteractiveCard({
  children,
  className,
  onClick,
  href,
  hoverEffect = 'lift',
  pressEffect = true,
  disabled = false,
}: InteractiveCardProps) {
  const [tiltStyle, setTiltStyle] = useState({})
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (hoverEffect !== 'tilt' || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`,
    })
  }

  const handleMouseLeave = () => {
    if (hoverEffect === 'tilt') {
      setTiltStyle({})
    }
  }

  const hoverEffects = {
    lift: {
      whileHover: { y: -4, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.15)' },
    },
    glow: {
      whileHover: { boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' },
    },
    border: {
      whileHover: {},
      className: 'hover:border-accent-400 dark:hover:border-accent-500',
    },
    scale: {
      whileHover: { scale: 1.02 },
    },
    tilt: {
      whileHover: {},
    },
    none: {
      whileHover: {},
    },
  }

  const effect = hoverEffects[hoverEffect]

  const CardWrapper = motion.div

  const cardProps = {
    ref: cardRef,
    style: hoverEffect === 'tilt' ? tiltStyle : undefined,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: disabled ? undefined : onClick,
    whileHover: disabled ? undefined : effect.whileHover,
    whileTap: disabled || !pressEffect ? undefined : { scale: 0.98 },
    transition: { duration: 0.2, ease: 'easeOut' },
    className: cn(
      'relative rounded-xl border transition-all duration-200',
      'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
      'border-neutral-200/50 dark:border-neutral-700/50',
      disabled ? 'opacity-50 cursor-not-allowed' : onClick || href ? 'cursor-pointer' : '',
      'effect' in effect && effect.className,
      className
    ),
  }

  if (href && !disabled) {
    return (
      <a href={href}>
        <CardWrapper {...cardProps}>{children}</CardWrapper>
      </a>
    )
  }

  return <CardWrapper {...cardProps}>{children}</CardWrapper>
}

// Hover reveal component - shows content on hover
interface HoverRevealProps {
  children: ReactNode
  revealContent: ReactNode
  className?: string
}

export function HoverReveal({ children, revealContent, className }: HoverRevealProps) {
  return (
    <motion.div
      className={cn('relative group', className)}
      whileHover="hover"
      initial="rest"
    >
      {children}
      <motion.div
        variants={{
          rest: { opacity: 0, y: 10, pointerEvents: 'none' as const },
          hover: { opacity: 1, y: 0, pointerEvents: 'auto' as const },
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {revealContent}
      </motion.div>
    </motion.div>
  )
}

// Magnetic hover effect - element follows cursor slightly
interface MagneticHoverProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticHover({ children, className, strength = 0.3 }: MagneticHoverProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) * strength
    const y = (e.clientY - centerY) * strength

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// Press feedback wrapper
interface PressFeedbackProps {
  children: ReactNode
  className?: string
  scale?: number
}

export function PressFeedback({ children, className, scale = 0.97 }: PressFeedbackProps) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
