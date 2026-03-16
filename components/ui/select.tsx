'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: {
    trigger: 'h-8 px-2.5 text-xs',
    option: 'px-2.5 py-1.5 text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    trigger: 'h-10 px-3 text-sm',
    option: 'px-3 py-2 text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    trigger: 'h-12 px-4 text-base',
    option: 'px-4 py-2.5 text-base',
    icon: 'w-5 h-5',
  },
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  className,
  size = 'md',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const styles = sizeStyles[size]

  const selectedOption = options.find((opt) => opt.value === value)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value)
            setIsOpen(false)
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, options, onChange])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-lg',
          'bg-white dark:bg-neutral-800/80',
          'border border-neutral-200 dark:border-neutral-700',
          'text-neutral-900 dark:text-white',
          'transition-all duration-200',
          'hover:border-accent-300 dark:hover:border-accent-600',
          'focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500',
          isOpen && 'border-accent-500 ring-2 ring-accent-500/20',
          disabled && 'opacity-50 cursor-not-allowed',
          styles.trigger
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-neutral-400 dark:text-neutral-500')}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={cn('text-neutral-400', styles.icon)} />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 w-full mt-1.5',
              'bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl',
              'border border-neutral-200 dark:border-neutral-700',
              'rounded-lg shadow-lg shadow-neutral-900/10 dark:shadow-neutral-900/30',
              'overflow-hidden'
            )}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'w-full flex items-center justify-between gap-2',
                    'text-left transition-colors duration-100',
                    styles.option,
                    highlightedIndex === index
                      ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50',
                    value === option.value && 'font-medium'
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon}
                    {option.label}
                  </span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className={cn('text-accent-500', styles.icon)} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Multi-select variant
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string[]
  onChange: (values: string[]) => void
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select options',
  label,
  disabled = false,
  className,
  size = 'md',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const styles = sizeStyles[size]

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2 rounded-lg',
          'bg-white dark:bg-neutral-800/80',
          'border border-neutral-200 dark:border-neutral-700',
          'text-neutral-900 dark:text-white',
          'transition-all duration-200',
          'hover:border-accent-300 dark:hover:border-accent-600',
          'focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500',
          isOpen && 'border-accent-500 ring-2 ring-accent-500/20',
          disabled && 'opacity-50 cursor-not-allowed',
          styles.trigger
        )}
      >
        <span className={cn('truncate', selectedOptions.length === 0 && 'text-neutral-400 dark:text-neutral-500')}>
          {selectedOptions.length > 0 ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-300 rounded">
                {selectedOptions.length}
              </span>
              <span className="truncate">
                {selectedOptions.length === 1 ? selectedOptions[0].label : `${selectedOptions.length} selected`}
              </span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={cn('text-neutral-400', styles.icon)} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 w-full mt-1.5',
              'bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl',
              'border border-neutral-200 dark:border-neutral-700',
              'rounded-lg shadow-lg shadow-neutral-900/10 dark:shadow-neutral-900/30',
              'overflow-hidden'
            )}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      'w-full flex items-center gap-2',
                      'text-left transition-colors duration-100',
                      styles.option,
                      isSelected
                        ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-accent-500 border-accent-500'
                          : 'border-neutral-300 dark:border-neutral-600'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="flex items-center gap-2 truncate">
                      {option.icon}
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
