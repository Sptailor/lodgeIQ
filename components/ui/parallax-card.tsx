'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxCardProps {
  children: ReactNode
  className?: string
  innerClassName?: string
  glareEnabled?: boolean
  tiltAmount?: number
  perspective?: number
  scale?: number
  transitionDuration?: number
}

export function ParallaxCard({
  children,
  className,
  innerClassName,
  glareEnabled = true,
  tiltAmount = 10,
  perspective = 1000,
  scale = 1.02,
  transitionDuration = 300,
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    )

    // Update glare position
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlarePosition({ x: glareX, y: glareY })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setTransform('')
    setGlarePosition({ x: 50, y: 50 })
  }

  return (
    <div
      ref={cardRef}
      className={cn('relative group', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform,
        transition: isHovering ? 'none' : `transform ${transitionDuration}ms ease-out`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card content */}
      <div className={cn('relative z-10', innerClassName)}>
        {children}
      </div>

      {/* Glare effect */}
      {glareEnabled && (
        <div
          className="absolute inset-0 z-20 pointer-events-none rounded-[inherit] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* 3D Shadow effect */}
      <div
        className="absolute inset-0 -z-10 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          transform: 'translateZ(-50px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      />
    </div>
  )
}

// Lighter version for smaller elements
export function TiltCard({
  children,
  className,
  tiltAmount = 5,
}: {
  children: ReactNode
  className?: string
  tiltAmount?: number
}) {
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(`perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  return (
    <div
      className={cn('transition-transform duration-200', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
    >
      {children}
    </div>
  )
}

// Floating card with depth layers
export function DepthCard({
  children,
  className,
  backgroundLayer,
  foregroundLayer,
}: {
  children: ReactNode
  className?: string
  backgroundLayer?: ReactNode
  foregroundLayer?: ReactNode
}) {
  return (
    <div className={cn('relative group', className)} style={{ transformStyle: 'preserve-3d' }}>
      {/* Background layer - moves opposite to hover */}
      {backgroundLayer && (
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2"
          style={{ transform: 'translateZ(-20px)' }}
        >
          {backgroundLayer}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
        {children}
      </div>

      {/* Foreground layer - moves with hover */}
      {foregroundLayer && (
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"
          style={{ transform: 'translateZ(20px)' }}
        >
          {foregroundLayer}
        </div>
      )}
    </div>
  )
}
