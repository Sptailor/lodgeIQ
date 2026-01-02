/**
 * InspectionHistory Component
 *
 * Premium inspection history cards with modern design
 * Shows past inspections with status, ratings, and easy navigation
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge, InspectionStatus } from '@/components/ui/status-badge'

type Inspection = {
  id: string
  inspectionDate: Date
  status: string
  overallRating: number | null
  inspector: {
    id: string
    name: string | null
    email: string
  }
  _count: {
    inspectionResults: number
  }
}

interface InspectionHistoryProps {
  inspections: Inspection[]
}


export default function InspectionHistory({ inspections }: InspectionHistoryProps) {
  if (inspections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-soft"
      >
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          Inspection History
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          No inspections yet. Start your first inspection above.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft"
    >
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-5">
        Inspection History ({inspections.length})
      </h2>

      <div className="space-y-3">
        {inspections.map((inspection, index) => {
          // Link to results page if completed, otherwise to inspection form
          const href =
            inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
              ? `/inspections/${inspection.id}/results`
              : `/inspections/${inspection.id}`

          return (
            <motion.div
              key={inspection.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={href}
                className="group block border-2 border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-soft transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date */}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
                        {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Inspector */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                        <span className="font-medium">
                          {inspection.inspector.name || inspection.inspector.email}
                        </span>
                      </p>
                    </div>

                    {/* Results count */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {inspection._count.inspectionResults} items completed
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* Status badge */}
                    <StatusBadge status={inspection.status as InspectionStatus} />

                    {/* Rating */}
                    {inspection.overallRating && (
                      <div className="flex items-center gap-1 bg-accent-50 dark:bg-accent-950/20 px-2.5 py-1 rounded-lg border border-accent-200 dark:border-accent-800">
                        <span className="text-base">⭐</span>
                        <span className="text-sm font-semibold text-accent-800 dark:text-accent-400">
                          {inspection.overallRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
