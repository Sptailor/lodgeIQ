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
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white shadow-soft hover:bg-primary-700 hover:shadow-soft-lg focus-visible:ring-primary-500',
        secondary:
          'bg-neutral-100 text-neutral-900 shadow-soft hover:bg-neutral-200 focus-visible:ring-neutral-400',
        success:
          'bg-success-600 text-white shadow-soft hover:bg-success-700 hover:shadow-soft-lg focus-visible:ring-success-500',
        warning:
          'bg-warning-600 text-white shadow-soft hover:bg-warning-700 focus-visible:ring-warning-500',
        danger:
          'bg-danger-600 text-white shadow-soft hover:bg-danger-700 focus-visible:ring-danger-500',
        outline:
          'border-2 border-neutral-200 bg-white hover:bg-neutral-50 hover:border-primary-300 focus-visible:ring-primary-500',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400',
        link:
          'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
      },
      size: {
        default: 'h-11 px-5 py-2.5 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-8 py-4 text-base',
        icon: 'h-10 w-10',
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
