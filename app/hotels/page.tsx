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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-stone-200 dark:border-neutral-800 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Properties
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your property portfolio and inspections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-accent-50/50 to-white dark:bg-neutral-900 border border-accent-200/60 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-accent-500 to-accent-600" />
          <div className="p-6">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-400 mb-3">Total Properties</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50/50 to-white dark:bg-neutral-900 border border-emerald-200/60 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="p-6">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-400 mb-3">Active Properties</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
          Add New Property
        </h2>
        <AddHotelForm />
      </div>

      {/* Hotels List */}
      <div>
        <HotelList initialHotels={hotels} />
      </div>
    </div>
  )
}
