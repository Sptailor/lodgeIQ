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

  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800 rounded-xl overflow-hidden">
      {/* Filter Header - Always Visible */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-accent-600 text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Content - Collapsible on Mobile */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Hotel Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Hotel
            </label>
            <select
              value={filters.hotelId || ''}
              onChange={(e) => handleFilterChange('hotelId', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
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
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Inspector
            </label>
            <select
              value={filters.inspectorId || ''}
              onChange={(e) => handleFilterChange('inspectorId', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
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
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Categories
            </label>
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-accent-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Status
            </label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <label key={status.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status.id)}
                    onChange={() => toggleStatus(status.id)}
                    className="w-4 h-4 text-accent-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-accent-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Active filters:</span>

              {filters.hotelId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full">
                  Hotel: {hotels.find((h) => h.id === filters.hotelId)?.label}
                  <button
                    onClick={() => handleFilterChange('hotelId', undefined)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.inspectorId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full">
                  Inspector: {inspectors.find((i) => i.id === filters.inspectorId)?.label}
                  <button
                    onClick={() => handleFilterChange('inspectorId', undefined)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full">
                  From: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', undefined)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full">
                  To: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', undefined)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.categories.map((categoryId) => (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full"
                >
                  {CATEGORY_OPTIONS.find((c) => c.id === categoryId)?.label}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.statuses.map((statusId) => (
                <span
                  key={statusId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-full"
                >
                  {STATUS_OPTIONS.find((s) => s.id === statusId)?.label}
                  <button
                    onClick={() => toggleStatus(statusId)}
                    className="hover:text-neutral-900 dark:hover:text-neutral-100"
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
