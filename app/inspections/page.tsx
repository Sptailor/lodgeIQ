/**
 * Inspections List Page
 *
 * Central page for viewing and managing all inspections
 * Shows inspection history across all hotels with filtering and search
 */

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Calendar, User, Building2, CheckCircle2 } from 'lucide-react'
import { StatusBadge, InspectionStatus } from '@/components/ui/status-badge'

/**
 * Fetch all inspections on the server
 */
async function getInspections() {
  try {
    const inspections = await prisma.inspection.findMany({
      orderBy: {
        inspectionDate: 'desc',
      },
      include: {
        hotel: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { inspectionResults: true },
        },
      },
    })
    return inspections
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return []
  }
}

export default async function InspectionsPage() {
  const inspections = await getInspections()

  const completedCount = inspections.filter(
    (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
  ).length

  const inProgressCount = inspections.filter(
    (i) => i.status === 'IN_PROGRESS'
  ).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          Inspections
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Track and manage all property inspections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Total Inspections</p>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{inspections.length}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Completed</p>
          <p className="text-2xl font-semibold text-success-600 dark:text-success-400">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">In Progress</p>
          <p className="text-2xl font-semibold text-warning-600 dark:text-warning-400">{inProgressCount}</p>
        </div>
      </div>

      {/* Inspections List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          All Inspections
        </h2>

        {inspections.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
            No inspections yet. Start your first inspection from a hotel page.
          </p>
        ) : (
          <div className="space-y-2.5">
            {inspections.map((inspection) => {
              const href =
                inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                  ? `/inspections/${inspection.id}/results`
                  : `/inspections/${inspection.id}`

              return (
                <Link
                  key={inspection.id}
                  href={href}
                  className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
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
                          <span className="text-sm">⭐</span>
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
        )}
      </div>
    </div>
  )
}
