/**
 * Inspections List Page
 *
 * Central page for viewing and managing all inspections
 * Shows inspection history across all hotels with filtering and search
 */

import { prisma } from '@/lib/prisma'
import InspectionsList from '@/components/InspectionsList'
import { Breadcrumb } from '@/components/ui/breadcrumb'

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
      {/* Breadcrumb navigation */}
      <Breadcrumb items={[{ label: 'Inspections' }]} />

      {/* Page Header */}
      <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-neutral-900/90 dark:via-neutral-900/80 dark:to-neutral-900/90 rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl shadow-neutral-200/50 dark:shadow-neutral-950/50">

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-teal-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total Inspections</p>
              <div className="w-10 h-10 rounded-lg bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50">{inspections.length}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">All time</p>
          </div>
        </div>
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Completed</p>
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400">{completedCount}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{inspections.length > 0 ? Math.round((completedCount / inspections.length) * 100) : 0}% completion rate</p>
          </div>
        </div>
        <div className="group relative bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">In Progress</p>
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-amber-600 dark:text-amber-400">{inProgressCount}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Awaiting completion</p>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-5">
          All Inspections
        </h2>
        <InspectionsList initialInspections={inspections} />
      </div>
    </div>
  )
}
