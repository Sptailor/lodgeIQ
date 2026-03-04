'use client'

/**
 * Input Component
 *
 * Enhanced form input with animated focus states
 * Includes variants for different contexts
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Search, X } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'underlined'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, variant = 'default', ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const variantClasses = {
      default: `
        border border-neutral-300 dark:border-neutral-600
        bg-white dark:bg-neutral-800
        rounded-lg
        focus:border-accent-500 dark:focus:border-accent-500
        focus:ring-2 focus:ring-accent-500/20
      `,
      filled: `
        border-0
        bg-neutral-100 dark:bg-neutral-800
        rounded-lg
        focus:bg-white dark:focus:bg-neutral-700
        focus:ring-2 focus:ring-accent-500/20
        focus:shadow-md
      `,
      underlined: `
        border-0 border-b-2 border-neutral-300 dark:border-neutral-600
        bg-transparent
        rounded-none
        focus:border-accent-500 dark:focus:border-accent-500
        px-0
      `,
    }

    return (
      <div className="w-full space-y-1.5">
        {/* Label */}
        {label && (
          <motion.label
            animate={{
              color: isFocused ? 'rgb(20, 184, 166)' : error ? 'rgb(239, 68, 68)' : undefined,
            }}
            className={cn(
              'block text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-200',
              error && 'text-danger-600 dark:text-danger-400'
            )}
          >
            {label}
          </motion.label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none transition-colors duration-200">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            type={inputType}
            className={cn(
              'flex w-full px-4 py-2.5 text-sm',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'transition-all duration-200',
              'outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-800',
              variantClasses[variant],
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error && 'border-danger-500 dark:border-danger-500 focus:border-danger-500 focus:ring-danger-500/20',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right icon / Password toggle */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500">{rightIcon}</span>
              )}
            </div>
          )}

          {/* Focus indicator line for underlined variant */}
          {variant === 'underlined' && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isFocused ? 1 : 0 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 origin-center"
            />
          )}
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-danger-600 dark:text-danger-400 flex items-center gap-1"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-danger-500" />
            {error}
          </motion.p>
        )}

        {/* Hint text */}
        {hint && !error && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Search Input preset
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon' | 'type'> {
  onClear?: () => void
  value?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            value && onClear ? (
              <button
                type="button"
                onClick={onClear}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : undefined
          }
          value={value}
          className={cn('pr-10', className)}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <motion.label
            animate={{
              color: isFocused ? 'rgb(20, 184, 166)' : error ? 'rgb(239, 68, 68)' : undefined,
            }}
            className={cn(
              'block text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-200',
              error && 'text-danger-600 dark:text-danger-400'
            )}
          >
            {label}
          </motion.label>
        )}

        <textarea
          className={cn(
            'flex min-h-[100px] w-full px-4 py-3 text-sm',
            'border border-neutral-300 dark:border-neutral-600',
            'bg-white dark:bg-neutral-800',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'rounded-lg resize-none',
            'transition-all duration-200',
            'outline-none',
            'focus:border-accent-500 dark:focus:border-accent-500',
            'focus:ring-2 focus:ring-accent-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger-500 dark:border-danger-500',
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-danger-600 dark:text-danger-400 flex items-center gap-1"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-danger-500" />
            {error}
          </motion.p>
        )}

        {hint && !error && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, SearchInput, Textarea }
