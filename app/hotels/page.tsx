/**
 * Hotels List Page
 *
 * Central page for managing all hotels
 * Shows all hotels with search, filter, and management capabilities
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'

/**
 * Fetch all hotels on the server
 */
async function getHotels() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { inspections: true },
        },
      },
    })
    return hotels
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return []
  }
}

export default async function HotelsPage() {
  const hotels = await getHotels()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Property Management
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400">
              Manage your property portfolio and inspections
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Properties</p>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft">
        <AddHotelForm />
      </div>

      {/* Hotels List */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
            All Properties
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} in total
          </p>
        </div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}
