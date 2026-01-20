'use client'

/**
 * ReportsClientWrapper Component
 *
 * Client-side wrapper for Reports page
 * Handles FilterBar, ExportButton, page header with filtered count, and data tables
 */

import { FilterBar, FilterOption, FilterState } from '@/components/ui/filter-bar'
import { DataTable, Column } from '@/components/ui/data-table'
import { ExportButton, ExportColumn } from '@/components/ui/export-button'
import { Calendar, Hotel, User, Star, FileText } from 'lucide-react'
import Link from 'next/link'

interface InspectionRow {
  id: string
  date: Date
  hotel: string
  hotelId?: string
  inspector: string
  rating: number
  cleanliness: number
  safety: number
  amenities: number
  status: string
}

interface ReportsClientWrapperProps {
  hotels: FilterOption[]
  inspectors: FilterOption[]
  totalInspections: number
  activeFilters: Record<string, any>
  inspectionsData: InspectionRow[]
  children: React.ReactNode
}

export function ReportsClientWrapper({
  hotels,
  inspectors,
  totalInspections,
  activeFilters,
  inspectionsData,
  children,
}: ReportsClientWrapperProps) {
  const handleFilterChange = (filters: FilterState) => {
    // URL updates are handled by FilterBar component
    // This callback is available for future use if needed
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
      APPROVED: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
      IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    }
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          colors[status as keyof typeof colors] || 'bg-neutral-100 text-neutral-700'
        }`}
      >
        {status.replace('_', ' ')}
      </span>
    )
  }

  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{rating.toFixed(1)}</span>
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      </div>
    )
  }

  // Inspections table columns
  const inspectionsColumns: Column<InspectionRow>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      key: 'hotel',
      label: 'Hotel',
      sortable: true,
      render: (value, row) =>
        row.hotelId ? (
          <Link href={`/hotels/${row.hotelId}`} className="text-accent-600 dark:text-accent-400 hover:underline font-medium">
            {value}
          </Link>
        ) : (
          value
        ),
    },
    {
      key: 'inspector',
      label: 'Inspector',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Overall',
      sortable: true,
      render: (value) => <RatingStars rating={value} />,
    },
    {
      key: 'cleanliness',
      label: 'Cleanliness',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'safety',
      label: 'Safety',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'amenities',
      label: 'Amenities',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden xl:table-cell',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <Link
          href={`/inspections/${value}`}
          className="text-accent-600 dark:text-accent-400 hover:underline text-sm font-medium"
        >
          View Details
        </Link>
      ),
    },
  ]

  // Export columns for Inspections table
  const inspectionsExportColumns: ExportColumn[] = [
    { key: 'date', label: 'Date', format: (value) => new Date(value).toLocaleDateString() },
    { key: 'hotel', label: 'Hotel' },
    { key: 'inspector', label: 'Inspector' },
    { key: 'rating', label: 'Overall Rating', format: (value) => value.toFixed(1) },
    { key: 'cleanliness', label: 'Cleanliness', format: (value) => value.toFixed(1) },
    { key: 'safety', label: 'Safety', format: (value) => value.toFixed(1) },
    { key: 'amenities', label: 'Amenities', format: (value) => value.toFixed(1) },
    { key: 'status', label: 'Status' },
  ]

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

          {/* Export Button and Count */}
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

      {/* Report Content (server-rendered charts and status overview) */}
      {children}

      {/* Recent Inspections Table */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Recent Inspections
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Detailed view of all inspection records
            </p>
          </div>
          <ExportButton
            data={inspectionsData}
            columns={inspectionsExportColumns}
            filename="inspections-report"
            title="Inspections Report"
            filters={activeFilters}
          />
        </div>
        <DataTable
          columns={inspectionsColumns}
          data={inspectionsData}
          defaultSort={{ key: 'date', direction: 'desc' }}
          pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50] }}
          emptyMessage="No inspections found matching your filters"
        />
      </div>
    </div>
  )
}
