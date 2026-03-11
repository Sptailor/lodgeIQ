'use client'

import { cn } from '@/lib/utils'

type DividerVariant = 'diagonal' | 'wave' | 'curve' | 'zigzag'
type DividerDirection = 'up' | 'down'

interface DiagonalDividerProps {
  variant?: DividerVariant
  direction?: DividerDirection
  className?: string
  fillClassName?: string
  height?: number
}

export function DiagonalDivider({
  variant = 'diagonal',
  direction = 'down',
  className,
  fillClassName = 'fill-white/70 dark:fill-neutral-900/70',
  height = 60,
}: DiagonalDividerProps) {
  const paths: Record<DividerVariant, Record<DividerDirection, string>> = {
    diagonal: {
      down: 'M0,0 L100,0 L100,100 L0,100 Z',
      up: 'M0,100 L100,0 L100,100 Z',
    },
    wave: {
      down: 'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z',
      up: 'M0,100 L0,50 Q25,100 50,50 T100,50 L100,100 Z',
    },
    curve: {
      down: 'M0,0 Q50,100 100,0 L100,100 L0,100 Z',
      up: 'M0,100 Q50,0 100,100 Z',
    },
    zigzag: {
      down: 'M0,0 L10,50 L20,0 L30,50 L40,0 L50,50 L60,0 L70,50 L80,0 L90,50 L100,0 L100,100 L0,100 Z',
      up: 'M0,100 L10,50 L20,100 L30,50 L40,100 L50,50 L60,100 L70,50 L80,100 L90,50 L100,100 Z',
    },
  }

  return (
    <div className={cn('w-full overflow-hidden pointer-events-none', className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path d={paths[variant][direction]} className={fillClassName} />
      </svg>
    </div>
  )
}

// Decorative diagonal stripe accent
export function DiagonalStripe({
  className,
  colors = ['from-accent-500/20', 'to-teal-500/20'],
}: {
  className?: string
  colors?: [string, string]
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      <div
        className={cn(
          'absolute -inset-[100%] bg-gradient-to-r opacity-50',
          colors[0],
          colors[1]
        )}
        style={{
          transform: 'rotate(-12deg)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
