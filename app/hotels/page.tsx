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
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-8 shadow-soft-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Hotels
              </h1>
              <p className="text-primary-100 dark:text-primary-200 text-lg">
                Manage your hotel database and track inspections
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Total Hotels</p>
              <p className="text-3xl font-bold text-white">{hotels.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Properties Managed</p>
              <p className="text-3xl font-bold text-white">{hotels.length}</p>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Add Hotel Form */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
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
