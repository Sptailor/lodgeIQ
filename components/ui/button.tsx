/**
 * Button Component
 *
 * Professional button component with variants, animations, and loading states
 * Based on shadcn/ui patterns with travel-industry styling
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden group',
  {
    variants: {
      variant: {
        default:
          'bg-accent-500 text-white shadow-sm hover:bg-accent-600 hover:shadow-md focus-visible:ring-accent-500 dark:bg-accent-600 dark:hover:bg-accent-500',
        secondary:
          'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-700',
        success:
          'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md focus-visible:ring-teal-500',
        warning:
          'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md focus-visible:ring-amber-500',
        danger:
          'bg-danger-500 text-white hover:bg-danger-600 hover:shadow-md focus-visible:ring-danger-500',
        outline:
          'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800 focus-visible:ring-accent-500',
        ghost:
          'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 focus-visible:ring-accent-500',
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
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loadingText, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 pointer-events-none" />

        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText || 'Loading...'}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Loading Button - pre-configured for async operations
interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
  loadingText?: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading, loadingText, children, ...props }, ref) => {
    return (
      <Button ref={ref} isLoading={isLoading} loadingText={loadingText} {...props}>
        {children}
      </Button>
    )
  }
)
LoadingButton.displayName = 'LoadingButton'

// Icon Button - for icon-only buttons with tooltip support
interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: React.ReactNode
  label: string
  size?: 'sm' | 'default' | 'lg'
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'default', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
    }

    return (
      <Button
        ref={ref}
        size="icon"
        className={cn(sizeClasses[size], className)}
        aria-label={label}
        title={label}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = 'IconButton'

export { Button, LoadingButton, IconButton, buttonVariants }
