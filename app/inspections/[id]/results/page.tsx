/**
 * Inspection Results Review Page
 *
 * Displays completed inspection results with photos
 * Shows all checklist items, ratings, notes, and uploaded photos
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge, InspectionStatus, ResultStatus, getStatusBorderColor } from '@/components/ui/status-badge'

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

  // Group results by category
  const groupedResults = inspection.inspectionResults.reduce((acc, result) => {
    const category = result.checklistItem.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(result)
    return acc
  }, {} as Record<string, typeof inspection.inspectionResults>)

  const categories = Object.keys(groupedResults)

  // Calculate statistics
  const totalItems = inspection.inspectionResults.length
  const passCount = inspection.inspectionResults.filter((r) => r.result === 'PASS').length
  const failCount = inspection.inspectionResults.filter((r) => r.result === 'FAIL').length
  const needsImprovementCount = inspection.inspectionResults.filter(
    (r) => r.result === 'NEEDS_IMPROVEMENT'
  ).length

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back link */}
      <Link
        href={`/hotels/${inspection.hotel.id}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to {inspection.hotel.name}
      </Link>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inspection Results
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {inspection.hotel.name} • {inspection.hotel.city}, {inspection.hotel.country}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Inspector</p>
            <p className="font-medium text-gray-900">{inspection.inspector.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-900">
              {new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {inspection.overallRating && (
            <div>
              <p className="text-sm text-gray-500">Overall Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                ⭐ {inspection.overallRating.toFixed(1)}/5
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <StatusBadge status={inspection.status as InspectionStatus} size="lg" />
          </div>
        </div>

        {/* Summary statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{passCount}</p>
            <p className="text-sm text-gray-600">Passed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-700">{needsImprovementCount}</p>
            <p className="text-sm text-gray-600">Needs Attention</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{failCount}</p>
            <p className="text-sm text-gray-600">Failed</p>
          </div>
        </div>
      </div>

      {/* General notes */}
      {inspection.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            General Notes
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{inspection.notes}</p>
        </div>
      )}

      {/* Results by category */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {category}
            </h2>

            <div className="space-y-6">
              {groupedResults[category].map((result) => (
                <div
                  key={result.id}
                  className="border-l-4 pl-4 py-2"
                  style={{
                    borderLeftColor: getStatusBorderColor(result.result as ResultStatus),
                  }}
                >
                  {/* Item name and status */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {result.checklistItem.itemName}
                      </h3>
                      {result.checklistItem.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {result.checklistItem.description}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={result.result as ResultStatus} size="sm" className="ml-4" />
                  </div>

                  {/* Notes */}
                  {result.notes && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {result.notes}
                      </p>
                    </div>
                  )}

                  {/* Photos */}
                  {result.photoUrls && result.photoUrls.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Photos ({result.photoUrls.length}):
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {result.photoUrls.map((url, index) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={url}
                              alt={`Photo ${index + 1} for ${result.checklistItem.itemName}`}
                              className="w-full h-32 object-cover rounded border border-gray-200 hover:border-blue-500 transition-colors"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
