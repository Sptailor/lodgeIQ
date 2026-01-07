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
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-accent-600 text-white shadow-sm hover:bg-accent-700 focus-visible:ring-accent-500 dark:bg-accent-600 dark:hover:bg-accent-700',
        secondary:
          'bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 focus-visible:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        success:
          'bg-success-600 text-white shadow-sm hover:bg-success-700 focus-visible:ring-success-500',
        warning:
          'bg-warning-600 text-white shadow-sm hover:bg-warning-700 focus-visible:ring-warning-500',
        danger:
          'bg-danger-600 text-white shadow-sm hover:bg-danger-700 focus-visible:ring-danger-500',
        outline:
          'border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-accent-400 focus-visible:ring-accent-500 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
        link:
          'text-accent-600 underline-offset-4 hover:underline focus-visible:ring-accent-500 dark:text-accent-400',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-5 py-2.5 text-sm',
        xl: 'h-12 px-6 py-3 text-base',
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
