/**
 * Inspection Results Review Page
 *
 * Server component that fetches data and passes to client component
 * Enhanced with professional visual hierarchy and premium design
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { InspectionResultsClient } from './InspectionResultsClient'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Fetch inspection with full results including photos
 */
async function getInspectionResults(id: string) {
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
        orderBy: [
          { checklistItem: { category: 'asc' } },
          { checklistItem: { order: 'asc' } },
        ],
      },
    },
  })

  return inspection
}

export default async function InspectionResultsPage({ params }: PageProps) {
  const inspection = await getInspectionResults(params.id)

  if (!inspection) {
    notFound()
  }

  return <InspectionResultsClient inspection={inspection} />
}
