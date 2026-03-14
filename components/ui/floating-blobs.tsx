'use client'

import { cn } from '@/lib/utils'

interface BlobProps {
  className?: string
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animation?: 'float' | 'pulse' | 'drift'
  delay?: number
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-40 h-40',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96',
}

const animationClasses = {
  float: 'animate-blob-float',
  pulse: 'animate-blob-pulse',
  drift: 'animate-blob-drift',
}

function Blob({ className, color, size = 'md', animation = 'float', delay = 0 }: BlobProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full blur-3xl opacity-15 dark:opacity-10',
        sizeClasses[size],
        animationClasses[animation],
        color || 'bg-accent-500',
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

interface FloatingBlobsProps {
  className?: string
  variant?: 'default' | 'hero' | 'subtle' | 'vibrant'
}

export function FloatingBlobs({ className, variant = 'default' }: FloatingBlobsProps) {
  const variants = {
    default: (
      <>
        <Blob
          color="bg-accent-500"
          size="lg"
          className="top-0 -left-32"
          animation="float"
          delay={0}
        />
        <Blob
          color="bg-accent-400"
          size="md"
          className="top-20 right-0"
          animation="drift"
          delay={2}
        />
        <Blob
          color="bg-accent-300"
          size="sm"
          className="bottom-10 left-1/3"
          animation="pulse"
          delay={4}
        />
      </>
    ),
    hero: (
      <>
        <Blob
          color="bg-gradient-to-br from-accent-500 to-accent-600"
          size="xl"
          className="-top-48 -right-48"
          animation="float"
          delay={0}
        />
        <Blob
          color="bg-gradient-to-br from-accent-400 to-accent-500"
          size="lg"
          className="-bottom-32 -left-32"
          animation="drift"
          delay={3}
        />
        <Blob
          color="bg-accent-300"
          size="md"
          className="top-1/2 right-1/4"
          animation="pulse"
          delay={1.5}
        />
      </>
    ),
    subtle: (
      <>
        <Blob
          color="bg-accent-500/50"
          size="md"
          className="top-0 right-0 opacity-20"
          animation="float"
          delay={0}
        />
        <Blob
          color="bg-accent-400/50"
          size="sm"
          className="bottom-0 left-0 opacity-20"
          animation="drift"
          delay={2}
        />
      </>
    ),
    vibrant: (
      <>
        <Blob
          color="bg-accent-500"
          size="xl"
          className="-top-20 -left-20 opacity-40"
          animation="float"
          delay={0}
        />
        <Blob
          color="bg-accent-600"
          size="lg"
          className="top-40 -right-20 opacity-40"
          animation="drift"
          delay={1}
        />
        <Blob
          color="bg-accent-400"
          size="md"
          className="bottom-20 left-1/4 opacity-40"
          animation="pulse"
          delay={2}
        />
        <Blob
          color="bg-accent-300"
          size="sm"
          className="bottom-40 right-1/4 opacity-40"
          animation="float"
          delay={3}
        />
      </>
    ),
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {variants[variant]}
    </div>
  )
}

// Single decorative blob for custom positioning
export function DecorativeBlob({
  className,
  color = 'bg-accent-500',
  size = 'md',
  animation = 'float',
  delay = 0,
  blur = 'blur-3xl',
  opacity = 'opacity-30 dark:opacity-20',
}: BlobProps & { blur?: string; opacity?: string }) {
  return (
    <div
      className={cn(
        'absolute rounded-full',
        sizeClasses[size],
        animationClasses[animation],
        color,
        blur,
        opacity,
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}
