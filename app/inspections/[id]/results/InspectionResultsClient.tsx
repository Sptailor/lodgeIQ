/**
 * Inspection Results Client Component
 *
 * Premium results display with enhanced visual hierarchy
 * Professional card layouts and photo galleries with animations
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Calendar, User, Star, ImageIcon } from 'lucide-react'
import { StatusBadge, InspectionStatus, ResultStatus, getStatusBorderColor } from '@/components/ui/status-badge'

interface InspectionResultsClientProps {
  inspection: any
}

export function InspectionResultsClient({ inspection }: InspectionResultsClientProps) {
  // Group results by category
  const groupedResults = inspection.inspectionResults.reduce((acc: any, result: any) => {
    const category = result.checklistItem.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(result)
    return acc
  }, {})

  const categories = Object.keys(groupedResults)

  // Calculate statistics
  const totalItems = inspection.inspectionResults.length
  const passCount = inspection.inspectionResults.filter((r: any) => r.result === 'PASS').length
  const failCount = inspection.inspectionResults.filter((r: any) => r.result === 'FAIL').length
  const needsImprovementCount = inspection.inspectionResults.filter(
    (r: any) => r.result === 'NEEDS_IMPROVEMENT'
  ).length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/hotels/${inspection.hotel.id}`}
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {inspection.hotel.name}
      </Link>

      {/* Hero Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-8 shadow-soft-2xl"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Inspection Results
          </h1>
          <p className="text-primary-100 dark:text-primary-200 text-lg">
            {inspection.hotel.name} • {inspection.hotel.city}, {inspection.hotel.country}
          </p>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-primary-200" />
              <div>
                <p className="text-xs text-primary-200">Inspection Date</p>
                <p className="font-semibold">
                  {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-primary-200" />
              <div>
                <p className="text-xs text-primary-200">Inspector</p>
                <p className="font-semibold">{inspection.inspector.name || inspection.inspector.email}</p>
              </div>
            </div>

            {inspection.overallRating && (
              <div className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-accent-300 fill-accent-300" />
                <div>
                  <p className="text-xs text-primary-200">Overall Rating</p>
                  <p className="text-2xl font-bold">{inspection.overallRating.toFixed(1)}/5</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-primary-200 mb-1">Status</p>
              <StatusBadge status={inspection.status as InspectionStatus} size="md" className="bg-white/10 backdrop-blur-sm border-white/20" />
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </motion.div>

      {/* Summary Statistics KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{totalItems}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border-2 border-success-200 dark:border-success-800 rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Passed</p>
          <p className="text-3xl font-bold text-success-600 dark:text-success-400">{passCount}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border-2 border-warning-200 dark:border-warning-800 rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Needs Attention</p>
          <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">{needsImprovementCount}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border-2 border-danger-200 dark:border-danger-800 rounded-2xl p-5 shadow-soft">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Failed</p>
          <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">{failCount}</p>
        </div>
      </motion.div>

      {/* General notes */}
      {inspection.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft"
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
            General Notes
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">{inspection.notes}</p>
        </motion.div>
      )}

      {/* Results by category */}
      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 pb-3 border-b-2 border-neutral-200 dark:border-neutral-800">
              {category}
            </h2>

            <div className="space-y-5">
              {groupedResults[category].map((result: any, resultIndex: number) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + categoryIndex * 0.1 + resultIndex * 0.05 }}
                  className="relative pl-4 border-l-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-r-lg transition-colors"
                  style={{
                    borderLeftColor: getStatusBorderColor(result.result as ResultStatus),
                  }}
                >
                  {/* Item name and status */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                        {result.checklistItem.itemName}
                      </h3>
                      {result.checklistItem.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {result.checklistItem.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={result.result as ResultStatus} size="sm" />
                    </div>
                  </div>

                  {/* Notes */}
                  {result.notes && (
                    <div className="mb-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3">
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        Notes
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-relaxed pl-3.5">
                        {result.notes}
                      </p>
                    </div>
                  )}

                  {/* Photos - Enhanced Grid */}
                  {result.photoUrls && result.photoUrls.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        Photos ({result.photoUrls.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {result.photoUrls.map((url: string, photoIndex: number) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block aspect-square overflow-hidden rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all shadow-soft hover:shadow-soft-lg"
                          >
                            <img
                              src={url}
                              alt={`Photo ${photoIndex + 1} for ${result.checklistItem.itemName}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                                Photo {photoIndex + 1}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
