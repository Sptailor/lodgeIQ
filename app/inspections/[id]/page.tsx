/**
 * Inspection Form Page
 *
 * Interactive form to complete an inspection
 * Displays checklist items grouped by category
 * Allows marking PASS/FAIL/NEEDS_IMPROVEMENT and adding notes
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InspectionForm from '@/components/InspectionForm'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { ChevronLeft, Calendar, User } from 'lucide-react'
import { StatusBadge, InspectionStatus } from '@/components/ui/status-badge'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Fetch inspection with hotel and existing results
 */
async function getInspection(id: string) {
  const inspection = await prisma.inspection.findUnique({
    where: { id },
    include: {
      hotel: true,
      inspector: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      inspectionResults: {
        include: {
          checklistItem: true,
        },
      },
    },
  })

  return inspection
}

/**
 * Fetch all active checklist items
 */
async function getChecklistItems() {
  const items = await prisma.checklistItem.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
    ],
  })

  return items
}

export default async function InspectionPage({ params }: PageProps) {
  const [inspection, checklistItems] = await Promise.all([
    getInspection(params.id),
    getChecklistItems(),
  ])

  if (!inspection) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Breadcrumb navigation */}
      <Breadcrumb
        items={[
          { label: 'Inspections', href: '/inspections' },
          { label: inspection.hotel.name, href: `/hotels/${inspection.hotel.id}` },
          { label: 'Inspection Form' },
        ]}
      />

      {/* Header Card */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1 sm:mb-2">
            {inspection.hotel.name}
          </h1>
          <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 mb-3 sm:mb-4">
            {inspection.hotel.city}, {inspection.hotel.country}
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Inspection Date</p>
                <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                  {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Inspector</p>
                <p className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white truncate">{inspection.inspector.name || inspection.inspector.email}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Status</p>
              <StatusBadge status={inspection.status as InspectionStatus} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Inspection form */}
      <InspectionForm
        inspection={inspection}
        checklistItems={checklistItems}
      />
    </div>
  )
}
