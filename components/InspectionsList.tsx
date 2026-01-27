/**
 * InspectionsList Component
 *
 * Client-side component for displaying and filtering inspections
 * with search and filter functionality
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, Building2, CheckCircle2, Star } from 'lucide-react'
import { StatusBadge, InspectionStatus } from '@/components/ui/status-badge'
import { SearchBar } from '@/components/ui/search-bar'

type Inspection = {
  id: string
  inspectionDate: Date
  status: string
  overallRating: number | null
  hotel: {
    id: string
    name: string
  }
  inspector: {
    id: string
    name: string | null
    email: string
  }
  _count: {
    inspectionResults: number
  }
}

interface InspectionsListProps {
  initialInspections: Inspection[]
}

export default function InspectionsList({ initialInspections }: InspectionsListProps) {
  const [inspections] = useState<Inspection[]>(initialInspections)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedHotel, setSelectedHotel] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const itemsPerPage = 15

  // Get unique hotels and statuses for filter options
  const hotels = useMemo(() => {
    const uniqueHotels = Array.from(
      new Map(inspections.map((i) => [i.hotel.id, i.hotel])).values()
    ).sort((a, b) => a.name.localeCompare(b.name))
    return uniqueHotels
  }, [inspections])

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(inspections.map((i) => i.status))).sort()
    return uniqueStatuses
  }, [inspections])

  // Filter inspections based on search query and filters
  const filteredInspections = useMemo(() => {
    let filtered = inspections

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (inspection) =>
          inspection.hotel.name.toLowerCase().includes(query) ||
          (inspection.inspector.name && inspection.inspector.name.toLowerCase().includes(query)) ||
          inspection.inspector.email.toLowerCase().includes(query) ||
          inspection.status.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((inspection) => inspection.status === selectedStatus)
    }

    // Apply hotel filter
    if (selectedHotel !== 'all') {
      filtered = filtered.filter((inspection) => inspection.hotel.id === selectedHotel)
    }

    return filtered
  }, [inspections, searchQuery, selectedStatus, selectedHotel])

  // Paginate filtered inspections
  const paginatedInspections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredInspections.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredInspections, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatus, selectedHotel])

  // Handle page change with smooth transition
  const handlePageChange = (newPage: number) => {
    setIsChangingPage(true)
    setCurrentPage(newPage)
    setTimeout(() => setIsChangingPage(false), 300)
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (inspections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          No inspections yet
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Start your first inspection from a hotel page
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search inspections by hotel, inspector, or status..."
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Hotel Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Filter by Hotel
            </label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            >
              <option value="all">All Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 pb-2.5 whitespace-nowrap">
              {filteredInspections.length} {filteredInspections.length === 1 ? 'result' : 'results'}
            </p>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      {filteredInspections.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
          <p className="text-base font-bold text-neutral-900 dark:text-white mb-2">No inspections found</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className={`space-y-2.5 transition-opacity duration-300 ${isChangingPage ? 'opacity-50' : 'opacity-100'}`}>
            {paginatedInspections.map((inspection) => {
            const href =
              inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                ? `/inspections/${inspection.id}/results`
                : `/inspections/${inspection.id}`

            return (
              <Link
                key={inspection.id}
                href={href}
                className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-lg hover:shadow-accent-500/10 hover:border-accent-400 dark:hover:border-accent-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Hotel name */}
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate group-hover:text-accent-600 dark:group-hover:text-accent-500 transition-colors">
                        {inspection.hotel.name}
                      </p>
                    </div>

                    {/* Date & Inspector */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {inspection.inspector.name || inspection.inspector.email}
                        </p>
                      </div>
                    </div>

                    {/* Results count */}
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {inspection._count.inspectionResults} items completed
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* Status badge */}
                    <StatusBadge status={inspection.status as InspectionStatus} />

                    {/* Rating */}
                    {inspection.overallRating && (
                      <div className="flex items-center gap-1 bg-accent-50 dark:bg-accent-950/20 px-2 py-1 rounded-md border border-accent-200 dark:border-accent-800">
                        <Star className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 fill-accent-600 dark:fill-accent-400" />
                        <span className="text-xs font-medium text-accent-800 dark:text-accent-400">
                          {inspection.overallRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInspections.length)} of {filteredInspections.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-accent-600 text-white'
                            : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
                {/* Mobile page indicator */}
                <div className="sm:hidden px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                  className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
