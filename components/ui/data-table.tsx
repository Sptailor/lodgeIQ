'use client'

/**
 * DataTable Component
 *
 * Reusable table with sorting, pagination, and responsive design
 * Mobile: Card layout, Desktop: Traditional table
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, FileX } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  pagination?: { enabled: boolean; pageSize?: number; pageSizeOptions?: number[] }
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  defaultSort,
  pagination = { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50] },
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSort?.key || null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSort?.direction || 'asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue === bValue) return 0

      let comparison = 0
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else {
        comparison = aValue > bValue ? 1 : -1
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortKey, sortDirection])

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination.enabled])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: string) => {
    setIsTransitioning(true)
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setCurrentPage(1) // Reset to first page on sort
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handlePageChange = (page: number) => {
    setIsTransitioning(true)
    setCurrentPage(page)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handlePageSizeChange = (size: number) => {
    setIsTransitioning(true)
    setPageSize(size)
    setCurrentPage(1)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800 rounded-xl">
        <FileX className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mb-4" />
        <p className="text-neutral-600 dark:text-neutral-400 text-center">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800 rounded-xl relative">
        {isTransitioning && (
          <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="w-8 h-8 border-4 border-accent-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-4 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider
                    transition-all duration-200
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 hover:text-accent-600 dark:hover:text-accent-400' : ''}
                    ${sortKey === column.key ? 'bg-neutral-50 dark:bg-neutral-800/50 text-accent-600 dark:text-accent-400' : ''}
                    ${column.className || ''}
                  `}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <motion.span
                        className={`transition-colors ${sortKey === column.key ? 'text-accent-500' : 'text-neutral-400'}`}
                        animate={{ scale: sortKey === column.key ? 1.1 : 1 }}
                      >
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4" />
                        )}
                      </motion.span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={`
                    group
                    border-b border-neutral-100 dark:border-neutral-800/50
                    transition-all duration-200
                    ${index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-neutral-50/50 dark:bg-neutral-800/20'}
                    hover:bg-accent-50 dark:hover:bg-accent-900/20 hover:shadow-sm
                    ${onRowClick ? 'cursor-pointer active:bg-accent-100 dark:active:bg-accent-900/30' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={`
                        px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100
                        transition-all duration-200
                        ${colIndex === 0 ? 'relative group-hover:pl-7 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-accent-500 before:scale-y-0 group-hover:before:scale-y-100 before:transition-transform before:duration-200 before:origin-center' : ''}
                        ${column.className || ''}
                      `}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 relative">
        {isTransitioning && (
          <div className="absolute inset-0 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="w-8 h-8 border-4 border-accent-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {paginatedData.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={`
                bg-white dark:bg-neutral-900/70 backdrop-blur-xl
                border border-neutral-200/50 dark:border-neutral-800
                rounded-xl p-4 space-y-3
                shadow-sm hover:shadow-md
                transition-all duration-200
                ${onRowClick ? 'cursor-pointer hover:border-accent-400 dark:hover:border-accent-600 active:bg-accent-50/50 dark:active:bg-accent-900/20' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {column.label}
                  </span>
                  <span className="text-sm text-neutral-900 dark:text-neutral-100 text-right font-medium">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {pagination.enabled && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800 rounded-xl">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Show</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              {pagination.pageSizeOptions?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">per page</span>
          </div>

          {/* Page info */}
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {/* Page numbers */}
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

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
