'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({
  value,
  duration = 1500,
  className,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Parse numeric value
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateValue(0, numericValue, duration)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [numericValue, duration, hasAnimated])

  const animateValue = (start: number, end: number, dur: number) => {
    const startTime = performance.now()

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4)
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / dur, 1)
      const easedProgress = easeOutQuart(progress)

      const current = start + (end - start) * easedProgress
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  // Handle non-numeric values
  if (typeof value === 'string' && isNaN(parseFloat(value))) {
    return <span className={className}>{value}</span>
  }

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// Compact version for smaller numbers with bounce effect
export function BouncingCounter({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && displayValue === 0) {
            setIsAnimating(true)
            let current = 0
            const increment = Math.ceil(value / 20)

            const interval = setInterval(() => {
              current += increment
              if (current >= value) {
                setDisplayValue(value)
                setIsAnimating(false)
                clearInterval(interval)
              } else {
                setDisplayValue(current)
              }
            }, 50)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, displayValue])

  return (
    <span
      ref={ref}
      className={cn(
        'tabular-nums inline-block',
        isAnimating && 'animate-bounce-subtle',
        className
      )}
    >
      {displayValue}
    </span>
  )
}
