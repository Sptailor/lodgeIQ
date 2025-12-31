/**
 * InspectionHistory Component
 *
 * Displays a list of past inspections for a hotel
 */

'use client'

import Link from 'next/link'

type Inspection = {
  id: string
  inspectionDate: Date
  status: string
  overallRating: number | null
  inspector: {
    id: string
    name: string
    email: string
  }
  _count: {
    inspectionResults: number
  }
}

interface InspectionHistoryProps {
  inspections: Inspection[]
}

// Status badge styling
const statusColors: Record<string, string> = {
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

// Format status for display
const formatStatus = (status: string) => {
  return status.replace('_', ' ')
}

export default function InspectionHistory({ inspections }: InspectionHistoryProps) {
  if (inspections.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Inspection History
        </h2>
        <p className="text-gray-500 text-center">
          No inspections yet. Start your first inspection above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Inspection History ({inspections.length})
      </h2>

      <div className="space-y-4">
        {inspections.map((inspection) => {
          // Link to results page if completed, otherwise to inspection form
          const href =
            inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
              ? `/inspections/${inspection.id}/results`
              : `/inspections/${inspection.id}`

          return (
            <Link
              key={inspection.id}
              href={href}
              className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Date */}
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                {/* Inspector */}
                <p className="text-gray-700 mb-2">
                  Inspector: <span className="font-medium">{inspection.inspector.name}</span>
                </p>

                {/* Results count */}
                <p className="text-sm text-gray-600">
                  {inspection._count.inspectionResults} checklist items completed
                </p>
              </div>

              <div className="text-right">
                {/* Status badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                    statusColors[inspection.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {formatStatus(inspection.status)}
                </span>

                {/* Rating */}
                {inspection.overallRating && (
                  <p className="text-lg font-semibold text-gray-900">
                    ⭐ {inspection.overallRating.toFixed(1)}/5
                  </p>
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
