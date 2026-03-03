'use client'

/**
 * SearchBar Component
 *
 * Real-time search with debouncing
 * Auto-focuses on mount for better UX
 */

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Glow effect on focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-teal-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/40 group-focus-within:text-accent-400 transition-colors duration-300" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/8 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/12 focus:border-accent-500/50 shadow-glass transition-all duration-300"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
