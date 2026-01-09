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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/hotels/${inspection.hotel.id}`}
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {inspection.hotel.name}
      </Link>

      {/* Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-6 shadow-soft-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            {inspection.hotel.name}
          </h1>
          <p className="text-primary-100 dark:text-primary-200 mb-4">
            {inspection.hotel.city}, {inspection.hotel.country}
          </p>

          <div className="flex flex-wrap gap-6">
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

            <div>
              <p className="text-xs text-primary-200 mb-1">Status</p>
              <StatusBadge status={inspection.status as InspectionStatus} size="md" className="bg-white/10 backdrop-blur-sm border-white/20" />
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Inspection form */}
      <InspectionForm
        inspection={inspection}
        checklistItems={checklistItems}
      />
    </div>
  )
}
