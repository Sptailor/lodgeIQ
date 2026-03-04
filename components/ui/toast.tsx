/**
 * Toast Component
 *
 * Professional notification toast using Sonner
 * Enhanced styling with icons, animations, and dark mode support
 */

'use client'

import { Toaster as Sonner, toast as sonnerToast } from 'sonner'
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            'group toast',
            'flex items-start gap-3 w-full p-4',
            'bg-white dark:bg-neutral-900',
            'border border-neutral-200/80 dark:border-neutral-700/80',
            'rounded-xl',
            'shadow-lg shadow-neutral-200/50 dark:shadow-neutral-950/50',
            // Animation classes handled by Sonner
          ),
          title: 'text-sm font-semibold text-neutral-900 dark:text-neutral-100',
          description: 'text-sm text-neutral-500 dark:text-neutral-400 mt-1',
          actionButton: cn(
            'inline-flex items-center justify-center',
            'px-3 py-1.5 text-xs font-medium rounded-lg',
            'bg-accent-500 text-white',
            'hover:bg-accent-600',
            'transition-colors duration-200'
          ),
          cancelButton: cn(
            'inline-flex items-center justify-center',
            'px-3 py-1.5 text-xs font-medium rounded-lg',
            'bg-neutral-100 dark:bg-neutral-800',
            'text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-200 dark:hover:bg-neutral-700',
            'transition-colors duration-200'
          ),
          closeButton: cn(
            'absolute right-2 top-2',
            'rounded-full p-1',
            'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'transition-colors duration-200'
          ),
          success: 'border-l-4 border-l-teal-500',
          error: 'border-l-4 border-l-danger-500',
          warning: 'border-l-4 border-l-amber-500',
          info: 'border-l-4 border-l-accent-500',
          loading: 'border-l-4 border-l-neutral-400',
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-accent-500 flex-shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-neutral-400 flex-shrink-0 animate-spin" />,
      }}
      {...props}
    />
  )
}

// Helper functions for common toast patterns
const toast = {
  // Basic toasts
  success: (message: string, options?: Parameters<typeof sonnerToast.success>[1]) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) =>
    sonnerToast.error(message, options),

  warning: (message: string, options?: Parameters<typeof sonnerToast.warning>[1]) =>
    sonnerToast.warning(message, options),

  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) =>
    sonnerToast.info(message, options),

  // Loading toast with promise
  loading: (message: string, options?: Parameters<typeof sonnerToast.loading>[1]) =>
    sonnerToast.loading(message, options),

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    }
  ) => sonnerToast.promise(promise, messages),

  // Dismiss toasts
  dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),

  // Custom toast with more control
  custom: (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
    sonnerToast(message, options),

  // Action toast with button
  action: (
    message: string,
    action: { label: string; onClick: () => void },
    options?: Parameters<typeof sonnerToast>[1]
  ) =>
    sonnerToast(message, {
      ...options,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    }),
}

export { Toaster, toast }
