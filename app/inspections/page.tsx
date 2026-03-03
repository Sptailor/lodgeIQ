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
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-5">
          All Inspections
        </h2>
        <InspectionsList initialInspections={inspections} />
      </div>
    </div>
  )
}
