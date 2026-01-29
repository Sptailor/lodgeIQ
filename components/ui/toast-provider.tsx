/**
 * Toast Notification Provider
 *
 * Wraps the application with toast notification capabilities
 */

'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 shadow-lg backdrop-blur-xl',
          title: 'text-neutral-900 dark:text-neutral-100 font-semibold',
          description: 'text-neutral-600 dark:text-neutral-400',
          actionButton:
            'bg-accent-600 text-white hover:bg-accent-700 transition-colors',
          cancelButton:
            'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors',
          closeButton:
            'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700',
        },
      }}
    />
  )
}
