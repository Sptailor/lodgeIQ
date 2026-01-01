/**
 * InspectionHistory Component
 *
 * Premium inspection history cards with modern design
 * Shows past inspections with status, ratings, and easy navigation
 */

'use client'

import Link from 'next/link'
import { Calendar, User, CheckCircle2, Clock, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

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

// Status badge styling with modern colors
const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  IN_PROGRESS: {
    bg: 'bg-warning-100 border-warning-300',
    text: 'text-warning-800',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    bg: 'bg-primary-100 border-primary-300',
    text: 'text-primary-800',
    icon: <FileCheck className="w-3.5 h-3.5" />,
  },
  APPROVED: {
    bg: 'bg-success-100 border-success-300',
    text: 'text-success-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  REJECTED: {
    bg: 'bg-danger-100 border-danger-300',
    text: 'text-danger-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
}

// Format status for display
const formatStatus = (status: string) => {
  return status.replace('_', ' ')
}

export default function InspectionHistory({ inspections }: InspectionHistoryProps) {
  if (inspections.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-soft">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Inspection History
        </h2>
        <p className="text-neutral-500 text-sm">
          No inspections yet. Start your first inspection above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-neutral-900 mb-5">
        Inspection History ({inspections.length})
      </h2>

      <div className="space-y-3">
        {inspections.map((inspection) => {
          // Link to results page if completed, otherwise to inspection form
          const href =
            inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
              ? `/inspections/${inspection.id}/results`
              : `/inspections/${inspection.id}`

          const statusStyle = statusStyles[inspection.status] || {
            bg: 'bg-neutral-100 border-neutral-300',
            text: 'text-neutral-800',
            icon: <FileCheck className="w-3.5 h-3.5" />,
          }

          return (
            <Link
              key={inspection.id}
              href={href}
              className="group block border-2 border-neutral-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-soft transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <p className="text-sm text-neutral-600 truncate">
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
                    <User className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <p className="text-sm text-neutral-700 truncate">
                      <span className="font-medium">
                        {inspection.inspector.name || inspection.inspector.email}
                      </span>
                    </p>
                  </div>

                  {/* Results count */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <p className="text-xs text-neutral-600">
                      {inspection._count.inspectionResults} items completed
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Status badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border",
                      statusStyle.bg,
                      statusStyle.text
                    )}
                  >
                    {statusStyle.icon}
                    {formatStatus(inspection.status)}
                  </span>

                  {/* Rating */}
                  {inspection.overallRating && (
                    <div className="flex items-center gap-1 bg-accent-50 px-2.5 py-1 rounded-lg border border-accent-200">
                      <span className="text-base">⭐</span>
                      <span className="text-sm font-semibold text-accent-800">
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
    </div>
  )
}
