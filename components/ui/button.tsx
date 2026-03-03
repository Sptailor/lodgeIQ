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
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-accent-500 text-white shadow-sm hover:bg-accent-600 focus-visible:ring-accent-500 dark:bg-accent-600 dark:hover:bg-accent-500',
        secondary:
          'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-100 dark:border-primary-700 dark:hover:bg-primary-700',
        success:
          'bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-500',
        warning:
          'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500',
        danger:
          'bg-danger-500 text-white hover:bg-danger-600 focus-visible:ring-danger-500',
        outline:
          'border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-200 dark:hover:bg-primary-800 focus-visible:ring-primary-500',
        ghost:
          'text-primary-600 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800 focus-visible:ring-primary-500',
        link:
          'text-accent-600 underline-offset-4 hover:underline dark:text-accent-400 focus-visible:ring-accent-500',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-6 py-2.5 text-sm',
        xl: 'h-12 px-8 py-3 text-base',
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
