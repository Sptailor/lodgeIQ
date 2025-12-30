/**
 * HotelList Component
 *
 * Displays a list of hotels in a responsive grid
 * Client Component for interactivity
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

// Type definition for Hotel with inspection count
type Hotel = {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone: string | null
  email: string | null
  website: string | null
  description: string | null
  createdAt: Date
  _count?: {
    inspections: number
  }
}

interface HotelListProps {
  initialHotels: Hotel[]
}

export default function HotelList({ initialHotels }: HotelListProps) {
  const [hotels] = useState<Hotel[]>(initialHotels)

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No hotels found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add your first hotel using the form above
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <Link
          key={hotel.id}
          href={`/hotels/${hotel.id}`}
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
        >
          {/* Hotel name */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {hotel.name}
          </h3>

          {/* Location */}
          <p className="text-gray-600 text-sm mb-3">
            {hotel.city}, {hotel.country}
          </p>

          {/* Address */}
          <p className="text-gray-500 text-sm mb-3">{hotel.address}</p>

          {/* Contact info */}
          <div className="space-y-1 mb-4">
            {hotel.phone && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Phone:</span> {hotel.phone}
              </p>
            )}
            {hotel.email && (
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Email:</span> {hotel.email}
              </p>
            )}
          </div>

          {/* Inspection count */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-blue-600 font-medium">
              {hotel._count?.inspections || 0} inspection
              {hotel._count?.inspections !== 1 ? 's' : ''}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
