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
      <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-neutral-900/90 dark:via-neutral-900/80 dark:to-neutral-900/90 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-950/50">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="text-3xl font-black bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent mb-2">
            Inspections
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            Track and manage all property inspections
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1 bg-gradient-to-r from-accent-500 to-accent-600" />
          <div className="p-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Total Inspections</p>
            <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{inspections.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-800/40 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="p-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Completed</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-amber-200 dark:border-amber-800/40 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          <div className="p-5">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">In Progress</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{inProgressCount}</p>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
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
                  className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-accent-300 dark:hover:border-neutral-700 transition-all"
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
