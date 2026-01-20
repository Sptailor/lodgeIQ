'use client'

/**
 * ReportsClientWrapper Component
 *
 * Client-side wrapper for Reports page
 * Handles FilterBar, ExportButton, page header with filtered count
 */

import { FilterBar, FilterOption, FilterState } from '@/components/ui/filter-bar'
import { Download } from 'lucide-react'

interface ReportsClientWrapperProps {
  hotels: FilterOption[]
  inspectors: FilterOption[]
  totalInspections: number
  activeFilters: Record<string, any>
  children: React.ReactNode
}

export function ReportsClientWrapper({
  hotels,
  inspectors,
  totalInspections,
  activeFilters,
  children,
}: ReportsClientWrapperProps) {
  const handleFilterChange = (filters: FilterState) => {
    // URL updates are handled by FilterBar component
    // This callback is available for future use if needed
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header with Export */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>
        <div className="hidden sm:block absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary-100 to-tertiary-100 dark:from-primary-900/20 dark:to-tertiary-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="hidden sm:block absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-full blur-2xl opacity-50"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-3">
              Reports & Analytics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base md:text-lg">
              Detailed insights and trends from your inspection data
            </p>
          </div>

          {/* Export Button - Placeholder for now, will be implemented in table sections */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalInspections}</span> inspections
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        hotels={hotels}
        inspectors={inspectors}
        onFilterChange={handleFilterChange}
      />

      {/* Active Filters Summary */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-800 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-accent-900 dark:text-accent-100">
              Active Filters:
            </span>
            {Object.entries(activeFilters).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white dark:bg-accent-900 border border-accent-300 dark:border-accent-700 text-accent-700 dark:text-accent-300 rounded-full"
              >
                <span className="font-semibold">{key}:</span> {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Report Content (server-rendered) */}
      {children}
    </div>
  )
}
