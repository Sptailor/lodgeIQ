/**
 * Hotel Detail Page
 *
 * Shows hotel information and inspection history
 * Allows starting a new inspection
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StartInspectionButton from '@/components/StartInspectionButton'
import InspectionHistory from '@/components/InspectionHistory'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Fetch hotel with inspections on the server
 */
async function getHotel(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      inspections: {
        orderBy: { inspectionDate: 'desc' },
        include: {
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
      },
    },
  })

  return hotel
}

export default async function HotelDetailPage({ params }: PageProps) {
  const hotel = await getHotel(params.id)

  if (!hotel) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back link */}
      <a
        href="/"
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6 transition-colors"
      >
        ← Back to Hotels
      </a>

      {/* Hotel header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6 shadow-soft">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              {hotel.name}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              {hotel.city}, {hotel.country}
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">{hotel.address}</p>

            {/* Contact info */}
            <div className="space-y-2">
              {hotel.phone && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">Phone:</span> {hotel.phone}
                </p>
              )}
              {hotel.email && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">Email:</span> {hotel.email}
                </p>
              )}
              {hotel.website && (
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">Website:</span>{' '}
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {hotel.website}
                  </a>
                </p>
              )}
            </div>

            {hotel.description && (
              <p className="mt-4 text-neutral-700 dark:text-neutral-300">{hotel.description}</p>
            )}
          </div>

          {/* Start inspection button */}
          <div className="flex-shrink-0">
            <StartInspectionButton hotelId={hotel.id} hotelName={hotel.name} />
          </div>
        </div>
      </div>

      {/* Inspection history */}
      <InspectionHistory inspections={hotel.inspections} />
    </div>
  )
}
