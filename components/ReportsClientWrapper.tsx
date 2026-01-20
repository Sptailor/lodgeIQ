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
import { Calendar, Hotel, User, Star, FileText, TrendingUp, TrendingDown, Minus, AlertTriangle, Trophy } from 'lucide-react'
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

interface HotelPerformanceRow {
  id: string
  name: string
  location: string
  totalInspections: number
  avgRating: number
  cleanliness: number
  safety: number
  amenities: number
  lastInspection: Date | null
  trend: 'improving' | 'stable' | 'declining'
  isAtRisk: boolean
}

interface InspectorLeaderboardRow {
  id: string
  name: string
  total: number
  completed: number
  completedThisMonth: number
  avgRating: number
  cleanliness: number
  safety: number
  amenities: number
  completionRate: number
}

interface ReportsClientWrapperProps {
  hotels: FilterOption[]
  inspectors: FilterOption[]
  totalInspections: number
  activeFilters: Record<string, any>
  inspectionsData: InspectionRow[]
  hotelPerformanceData: HotelPerformanceRow[]
  inspectorLeaderboardData: InspectorLeaderboardRow[]
  children: React.ReactNode
}

export function ReportsClientWrapper({
  hotels,
  inspectors,
  totalInspections,
  activeFilters,
  inspectionsData,
  hotelPerformanceData,
  inspectorLeaderboardData,
  children,
}: ReportsClientWrapperProps) {
  const handleFilterChange = (filters: FilterState) => {
    // URL updates are handled by FilterBar component
    // This callback is available for future use if needed
  }

  // Find top 3 performers (non-at-risk hotels sorted by rating)
  const topPerformers = hotelPerformanceData
    .filter((h) => !h.isAtRisk)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3)
    .map((h) => h.id)

  // Find top 3 inspectors by completed inspections
  const topInspectors = inspectorLeaderboardData.slice(0, 3).map((i) => i.id)

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

  // Trend indicator component
  const TrendIndicator = ({ trend }: { trend: 'improving' | 'stable' | 'declining' }) => {
    if (trend === 'improving') {
      return (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Improving</span>
        </div>
      )
    }
    if (trend === 'declining') {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="w-4 h-4" />
          <span className="text-xs font-medium">Declining</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
        <Minus className="w-4 h-4" />
        <span className="text-xs font-medium">Stable</span>
      </div>
    )
  }

  // Hotel performance table columns
  const hotelPerformanceColumns: Column<HotelPerformanceRow>[] = [
    {
      key: 'name',
      label: 'Hotel',
      sortable: true,
      render: (value, row) => {
        const rankIndex = topPerformers.indexOf(row.id)
        const isTopPerformer = rankIndex !== -1

        return (
          <div className="flex items-center gap-2">
            {isTopPerformer && (
              <Trophy
                className={`w-4 h-4 ${
                  rankIndex === 0
                    ? 'text-yellow-500 fill-yellow-500'
                    : rankIndex === 1
                      ? 'text-gray-400 fill-gray-400'
                      : 'text-amber-600 fill-amber-600'
                }`}
              />
            )}
            <Link href={`/hotels/${row.id}`} className="text-accent-600 dark:text-accent-400 hover:underline font-medium">
              {value}
            </Link>
            {row.isAtRisk && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                AT RISK
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      className: 'hidden md:table-cell',
    },
    {
      key: 'totalInspections',
      label: 'Inspections',
      sortable: true,
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'avgRating',
      label: 'Avg Rating',
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
      key: 'lastInspection',
      label: 'Last Inspection',
      sortable: true,
      render: (value) =>
        value ? (
          <span className="text-sm">{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        ) : (
          <span className="text-sm text-neutral-400">N/A</span>
        ),
      className: 'hidden xl:table-cell',
    },
    {
      key: 'trend',
      label: 'Trend',
      sortable: true,
      render: (value) => <TrendIndicator trend={value} />,
    },
  ]

  // Export columns for Hotel Performance table
  const hotelPerformanceExportColumns: ExportColumn[] = [
    { key: 'name', label: 'Hotel' },
    { key: 'location', label: 'Location' },
    { key: 'totalInspections', label: 'Total Inspections' },
    { key: 'avgRating', label: 'Average Rating', format: (value) => value.toFixed(1) },
    { key: 'cleanliness', label: 'Cleanliness', format: (value) => value.toFixed(1) },
    { key: 'safety', label: 'Safety', format: (value) => value.toFixed(1) },
    { key: 'amenities', label: 'Amenities', format: (value) => value.toFixed(1) },
    {
      key: 'lastInspection',
      label: 'Last Inspection',
      format: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    { key: 'trend', label: 'Trend' },
    { key: 'isAtRisk', label: 'At Risk', format: (value) => (value ? 'Yes' : 'No') },
  ]

  // Progress bar component
  const ProgressBar = ({ value, color = 'accent' }: { value: number; color?: string }) => {
    const colorClasses = {
      accent: 'bg-accent-600',
      emerald: 'bg-emerald-600',
      amber: 'bg-amber-600',
    }

    return (
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.accent} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }

  // Inspector leaderboard table columns
  const inspectorLeaderboardColumns: Column<InspectorLeaderboardRow>[] = [
    {
      key: 'name',
      label: 'Inspector',
      sortable: true,
      render: (value, row) => {
        const rankIndex = topInspectors.indexOf(row.id)
        const isTopInspector = rankIndex !== -1

        return (
          <div className="flex items-center gap-2">
            {isTopInspector && (
              <Trophy
                className={`w-4 h-4 ${
                  rankIndex === 0
                    ? 'text-yellow-500 fill-yellow-500'
                    : rankIndex === 1
                      ? 'text-gray-400 fill-gray-400'
                      : 'text-amber-600 fill-amber-600'
                }`}
              />
            )}
            <span className="font-medium">{value}</span>
          </div>
        )
      },
    },
    {
      key: 'completed',
      label: 'Completed',
      sortable: true,
      render: (value) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{value}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      className: 'hidden md:table-cell',
    },
    {
      key: 'completedThisMonth',
      label: 'This Month',
      sortable: true,
      render: (value) => <span className="text-sm font-medium">{value}</span>,
      className: 'hidden lg:table-cell',
    },
    {
      key: 'avgRating',
      label: 'Avg Rating',
      sortable: true,
      render: (value) => <RatingStars rating={value} />,
    },
    {
      key: 'cleanliness',
      label: 'Cleanliness',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden xl:table-cell',
    },
    {
      key: 'safety',
      label: 'Safety',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden xl:table-cell',
    },
    {
      key: 'amenities',
      label: 'Amenities',
      sortable: true,
      render: (value) => <span className="text-sm">{value.toFixed(1)}</span>,
      className: 'hidden xl:table-cell',
    },
    {
      key: 'completionRate',
      label: 'Completion Rate',
      sortable: true,
      render: (value) => (
        <div className="space-y-1 min-w-[120px]">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">{value.toFixed(0)}%</span>
            {value >= 90 && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Excellent</span>
            )}
          </div>
          <ProgressBar value={value} color={value >= 90 ? 'emerald' : value >= 70 ? 'accent' : 'amber'} />
        </div>
      ),
    },
  ]

  // Export columns for Inspector Leaderboard table
  const inspectorLeaderboardExportColumns: ExportColumn[] = [
    { key: 'name', label: 'Inspector' },
    { key: 'total', label: 'Total Inspections' },
    { key: 'completed', label: 'Completed' },
    { key: 'completedThisMonth', label: 'Completed This Month' },
    { key: 'avgRating', label: 'Average Rating', format: (value) => value.toFixed(1) },
    { key: 'cleanliness', label: 'Cleanliness', format: (value) => value.toFixed(1) },
    { key: 'safety', label: 'Safety', format: (value) => value.toFixed(1) },
    { key: 'amenities', label: 'Amenities', format: (value) => value.toFixed(1) },
    { key: 'completionRate', label: 'Completion Rate (%)', format: (value) => value.toFixed(0) },
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

      {/* Hotel Performance Summary Table */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Hotel Performance Summary
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Top performers, at-risk properties, and performance trends
            </p>
          </div>
          <ExportButton
            data={hotelPerformanceData}
            columns={hotelPerformanceExportColumns}
            filename="hotel-performance-report"
            title="Hotel Performance Report"
            filters={activeFilters}
          />
        </div>
        <DataTable
          columns={hotelPerformanceColumns}
          data={hotelPerformanceData}
          defaultSort={{ key: 'avgRating', direction: 'desc' }}
          pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50] }}
          emptyMessage="No hotel data available"
        />
      </div>

      {/* Inspector Activity Leaderboard */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Inspector Activity Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Inspector rankings, completion rates, and performance metrics
            </p>
          </div>
          <ExportButton
            data={inspectorLeaderboardData}
            columns={inspectorLeaderboardExportColumns}
            filename="inspector-leaderboard-report"
            title="Inspector Activity Leaderboard"
            filters={activeFilters}
          />
        </div>
        <DataTable
          columns={inspectorLeaderboardColumns}
          data={inspectorLeaderboardData}
          defaultSort={{ key: 'completed', direction: 'desc' }}
          pagination={{ enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50] }}
          emptyMessage="No inspector data available"
        />
      </div>

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
