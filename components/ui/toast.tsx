/**
 * Toast Component
 *
 * Professional notification toast using Sonner
 * Travel-industry themed with icons and animations
 */

'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-neutral-950 group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-soft-lg rounded-xl',
          description: 'group-[.toast]:text-neutral-500',
          actionButton:
            'group-[.toast]:bg-primary-600 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
