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
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <a
          href={`/hotels/${inspection.hotel.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to {inspection.hotel.name}
        </a>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Inspecting: {inspection.hotel.name}
          </h1>
          <p className="text-gray-600 mb-1">
            {inspection.hotel.city}, {inspection.hotel.country}
          </p>
          <p className="text-sm text-gray-500">
            Inspector: {inspection.inspector.name} •{' '}
            {new Date(inspection.inspectionDate).toLocaleDateString()}
          </p>

          {/* Status badge */}
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {inspection.status.replace('_', ' ')}
            </span>
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
