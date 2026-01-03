/**
 * Inspections List Page
 *
 * Central page for viewing and managing all inspections
 * Shows inspection history across all hotels with filtering and search
 */

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ClipboardCheck, Calendar, User, Building2, CheckCircle2 } from 'lucide-react'
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-8 shadow-soft-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Inspections
              </h1>
              <p className="text-primary-100 dark:text-primary-200 text-lg">
                View and manage all hotel inspections
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Total Inspections</p>
              <p className="text-3xl font-bold text-white">{inspections.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Completed</p>
              <p className="text-3xl font-bold text-white">{completedCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-white">{inProgressCount}</p>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Inspections List */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-5">
          All Inspections ({inspections.length})
        </h2>

        {inspections.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
            No inspections yet. Start your first inspection from a hotel page.
          </p>
        ) : (
          <div className="space-y-3">
            {inspections.map((inspection) => {
              const href =
                inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                  ? `/inspections/${inspection.id}/results`
                  : `/inspections/${inspection.id}`

              return (
                <Link
                  key={inspection.id}
                  href={href}
                  className="group block border-2 border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-soft transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Hotel name */}
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                        <p className="text-base font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                          {inspection.hotel.name}
                        </p>
                      </div>

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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
