'use client'

import { useState, useCallback, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface UseRippleReturn {
  ripples: Ripple[]
  createRipple: (event: MouseEvent<HTMLElement>) => void
  RippleContainer: () => JSX.Element
}

export function useRipple(color: string = 'rgba(255, 255, 255, 0.4)'): UseRippleReturn {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const createRipple = useCallback((event: MouseEvent<HTMLElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }, [])

  const RippleContainer = useCallback(
    () => (
      <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ opacity: 0.6, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          ))}
        </AnimatePresence>
      </span>
    ),
    [ripples, color]
  )

  return { ripples, createRipple, RippleContainer }
}

// Pre-built ripple button wrapper
interface RippleButtonProps {
  children: React.ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
  rippleColor?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function RippleButton({
  children,
  onClick,
  className,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  disabled = false,
  type = 'button',
}: RippleButtonProps) {
  const { createRipple, RippleContainer } = useRipple(rippleColor)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    createRipple(event)
    onClick?.(event)
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      <RippleContainer />
    </button>
  )
}

// Spotlight effect that follows cursor
interface SpotlightProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  size?: number
}

export function Spotlight({
  children,
  className,
  spotlightColor = 'rgba(34, 197, 94, 0.15)',
  size = 200,
}: SpotlightProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        animate={{
          opacity: isHovering ? 1 : 0,
          x: position.x - size / 2,
          y: position.y - size / 2,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Border glow effect that follows cursor
interface BorderGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function BorderGlow({
  children,
  className,
  glowColor = 'rgba(34, 197, 94, 0.6)',
}: BorderGlowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        '--glow-x': `${position.x}%`,
        '--glow-y': `${position.y}%`,
        '--glow-color': glowColor,
        '--glow-opacity': isHovering ? '1' : '0',
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at var(--glow-x) var(--glow-y), var(--glow-color), transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
