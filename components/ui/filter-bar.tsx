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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-glass">
      {/* Filter Header - Always Visible */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20">
            <Filter className="w-5 h-5 text-accent-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full shadow-glow">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Content - Collapsible */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Hotel Filter */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Hotel
            </label>
            <select
              value={filters.hotelId || ''}
              onChange={(e) => handleFilterChange('hotelId', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border border-white/10 bg-white/5 text-white rounded-xl focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-all"
            >
              <option value="" className="bg-neutral-900">All Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id} className="bg-neutral-900">
                  {hotel.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inspector Filter */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Inspector
            </label>
            <select
              value={filters.inspectorId || ''}
              onChange={(e) => handleFilterChange('inspectorId', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border border-white/10 bg-white/5 text-white rounded-xl focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-all"
            >
              <option value="" className="bg-neutral-900">All Inspectors</option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id} className="bg-neutral-900">
                  {inspector.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border border-white/10 bg-white/5 text-white rounded-xl focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
              className="w-full px-4 py-2.5 text-sm border border-white/10 bg-white/5 text-white rounded-xl focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Categories
            </label>
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-accent-500 bg-white/5 border-white/20 rounded focus:ring-2 focus:ring-accent-500/50"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Status
            </label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <label key={status.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status.id)}
                    onChange={() => toggleStatus(status.id)}
                    className="w-4 h-4 text-accent-500 bg-white/5 border-white/20 rounded focus:ring-2 focus:ring-accent-500/50"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white/70">Active filters:</span>

              {filters.hotelId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-primary-500/20 border border-primary-500/30 text-primary-300 rounded-full">
                  Hotel: {hotels.find((h) => h.id === filters.hotelId)?.label}
                  <button
                    onClick={() => handleFilterChange('hotelId', undefined)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.inspectorId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-accent-500/20 border border-accent-500/30 text-accent-300 rounded-full">
                  Inspector: {inspectors.find((i) => i.id === filters.inspectorId)?.label}
                  <button
                    onClick={() => handleFilterChange('inspectorId', undefined)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-full">
                  From: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', undefined)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-full">
                  To: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', undefined)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.categories.map((categoryId) => (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-coral-500/20 border border-coral-500/30 text-coral-300 rounded-full"
                >
                  {CATEGORY_OPTIONS.find((c) => c.id === categoryId)?.label}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.statuses.map((statusId) => (
                <span
                  key={statusId}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white/10 border border-white/20 text-white/80 rounded-full"
                >
                  {STATUS_OPTIONS.find((s) => s.id === statusId)?.label}
                  <button
                    onClick={() => toggleStatus(statusId)}
                    className="hover:text-white transition-colors"
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
