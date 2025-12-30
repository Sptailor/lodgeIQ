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
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Hotels
      </a>

      {/* Hotel header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {hotel.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {hotel.city}, {hotel.country}
            </p>
            <p className="text-gray-700 mb-4">{hotel.address}</p>

            {/* Contact info */}
            <div className="space-y-1">
              {hotel.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {hotel.phone}
                </p>
              )}
              {hotel.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {hotel.email}
                </p>
              )}
              {hotel.website && (
                <p className="text-gray-600">
                  <span className="font-medium">Website:</span>{' '}
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {hotel.website}
                  </a>
                </p>
              )}
            </div>

            {hotel.description && (
              <p className="mt-4 text-gray-700">{hotel.description}</p>
            )}
          </div>

          {/* Start inspection button */}
          <StartInspectionButton hotelId={hotel.id} />
        </div>
      </div>

      {/* Inspection history */}
      <InspectionHistory inspections={hotel.inspections} />
    </div>
  )
}
