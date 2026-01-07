/**
 * Hotels List Page
 *
 * Central page for managing all hotels
 * Shows all hotels with search, filter, and management capabilities
 */

import { prisma } from '@/lib/prisma'
import HotelList from '@/components/HotelList'
import AddHotelForm from '@/components/AddHotelForm'
import { Building2 } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-3">
            <Building2 className="w-7 h-7 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
              Hotels
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage your hotel database and track inspections
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Total Hotels</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">Properties Managed</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{hotels.length}</p>
          </div>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Add New Hotel
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
