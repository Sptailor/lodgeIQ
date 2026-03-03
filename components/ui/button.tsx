/**
 * Button Component
 *
 * Professional button component with variants and animations
 * Based on shadcn/ui patterns with travel-industry styling
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow hover:shadow-glow-lg hover:from-primary-500 hover:to-accent-500 focus-visible:ring-primary-500',
        secondary:
          'bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-glass hover:bg-white/15 hover:border-white/30 focus-visible:ring-white/30',
        success:
          'bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-glow-teal hover:from-teal-400 hover:to-teal-300 focus-visible:ring-teal-500',
        warning:
          'bg-gradient-to-r from-warning-500 to-warning-400 text-white hover:from-warning-400 hover:to-warning-300 focus-visible:ring-warning-500',
        danger:
          'bg-gradient-to-r from-danger-600 to-danger-500 text-white hover:from-danger-500 hover:to-danger-400 focus-visible:ring-danger-500',
        outline:
          'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-primary-400/50 focus-visible:ring-primary-500',
        ghost:
          'text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-white/20',
        link:
          'text-primary-400 underline-offset-4 hover:underline hover:text-primary-300 focus-visible:ring-primary-500',
        coral:
          'bg-gradient-to-r from-coral-500 to-pink-500 text-white shadow-glow-coral hover:from-coral-400 hover:to-pink-400 focus-visible:ring-coral-500',
      },
      size: {
        default: 'h-11 px-5 py-2.5 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6 py-3 text-sm',
        xl: 'h-14 px-8 py-3.5 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
