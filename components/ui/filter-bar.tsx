'use client'

/**
 * FilterBar Component
 *
 * Comprehensive filtering UI with URL-based state management
 * Supports: Hotel, Inspector, Date range, Category, and Status filters
 */

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X, Filter, ChevronDown } from 'lucide-react'

export interface FilterOption {
  id: string
  label: string
}

export interface FilterBarProps {
  hotels?: FilterOption[]
  inspectors?: FilterOption[]
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  hotelId?: string
  inspectorId?: string
  dateFrom?: string
  dateTo?: string
  categories: string[]
  statuses: string[]
}

const CATEGORY_OPTIONS = [
  { id: 'cleanliness', label: 'Cleanliness' },
  { id: 'safety', label: 'Safety' },
  { id: 'amenities', label: 'Amenities' },
]

const STATUS_OPTIONS = [
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'REJECTED', label: 'Rejected' },
]

export function FilterBar({ hotels = [], inspectors = [], onFilterChange }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>({
    hotelId: searchParams?.get('hotel') || undefined,
    inspectorId: searchParams?.get('inspector') || undefined,
    dateFrom: searchParams?.get('dateFrom') || undefined,
    dateTo: searchParams?.get('dateTo') || undefined,
    categories: searchParams?.get('categories')?.split(',').filter(Boolean) || [],
    statuses: searchParams?.get('statuses')?.split(',').filter(Boolean) || [],
  })

  const [isExpanded, setIsExpanded] = useState(true)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.hotelId) params.set('hotel', filters.hotelId)
    if (filters.inspectorId) params.set('inspector', filters.inspectorId)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','))
    if (filters.statuses.length > 0) params.set('statuses', filters.statuses.join(','))

    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(newUrl, { scroll: false })
    onFilterChange?.(filters)
  }, [filters, pathname, router, onFilterChange])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }))
  }

  const toggleStatus = (statusId: string) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(statusId)
        ? prev.statuses.filter((id) => id !== statusId)
        : [...prev.statuses, statusId],
    }))
  }

  const clearFilters = () => {
    setFilters({
      hotelId: undefined,
      inspectorId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      categories: [],
      statuses: [],
    })
  }

  const activeFilterCount =
    (filters.hotelId ? 1 : 0) +
    (filters.inspectorId ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    filters.categories.length +
    filters.statuses.length

  return (
    <div className="relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
      {/* Accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-teal-500 to-accent-500"></div>

      {/* Filter Header - Always Visible */}
      <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent-100 to-teal-100 dark:from-accent-900/30 dark:to-teal-900/30 shadow-sm">
            <Filter className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-accent-500 to-teal-500 text-white rounded-full shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Content - Collapsible */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Hotel Filter */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Hotel
            </label>
            <select
              value={filters.hotelId || ''}
              onChange={(e) => handleFilterChange('hotelId', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border-2 border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
            >
              <option value="">All Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inspector Filter */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Inspector
            </label>
            <select
              value={filters.inspectorId || ''}
              onChange={(e) => handleFilterChange('inspectorId', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border-2 border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
            >
              <option value="">All Inspectors</option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id}>
                  {inspector.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border-2 border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border-2 border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Categories
            </label>
            <div className="space-y-2.5">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-accent-500 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-accent-500/50"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Status
            </label>
            <div className="space-y-2.5">
              {STATUS_OPTIONS.map((status) => (
                <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status.id)}
                    onChange={() => toggleStatus(status.id)}
                    className="w-4 h-4 text-accent-500 bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-accent-500/50"
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="px-5 sm:px-6 py-4 border-t border-neutral-200/50 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Active filters:</span>

              {filters.hotelId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full shadow-sm">
                  Hotel: {hotels.find((h) => h.id === filters.hotelId)?.label}
                  <button
                    onClick={() => handleFilterChange('hotelId', undefined)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.inspectorId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700/50 text-accent-700 dark:text-accent-300 rounded-full shadow-sm">
                  Inspector: {inspectors.find((i) => i.id === filters.inspectorId)?.label}
                  <button
                    onClick={() => handleFilterChange('inspectorId', undefined)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 rounded-full shadow-sm">
                  From: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', undefined)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50 text-teal-700 dark:text-teal-300 rounded-full shadow-sm">
                  To: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', undefined)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.categories.map((categoryId) => (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-full shadow-sm"
                >
                  {CATEGORY_OPTIONS.find((c) => c.id === categoryId)?.label}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.statuses.map((statusId) => (
                <span
                  key={statusId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full shadow-sm"
                >
                  {STATUS_OPTIONS.find((s) => s.id === statusId)?.label}
                  <button
                    onClick={() => toggleStatus(statusId)}
                    className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
