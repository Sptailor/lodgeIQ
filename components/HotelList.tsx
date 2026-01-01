/**
 * HotelList Component
 *
 * Premium hotel cards with modern, travel-industry design
 * Responsive grid with smooth hover interactions
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, ClipboardCheck, Building2 } from 'lucide-react'

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
      <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 shadow-soft">
        <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-neutral-900 text-lg font-medium mb-1">No hotels yet</p>
        <p className="text-neutral-500 text-sm">
          Add your first hotel using the form above
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel) => (
        <Link
          key={hotel.id}
          href={`/hotels/${hotel.id}`}
          className="group block bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-soft-lg hover:border-primary-300 transition-all duration-200 cursor-pointer"
        >
          {/* Hotel header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1.5 group-hover:text-primary-600 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-start gap-1.5 text-neutral-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{hotel.city}, {hotel.country}</span>
            </div>
          </div>

          {/* Address */}
          <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{hotel.address}</p>

          {/* Contact info */}
          <div className="space-y-2 mb-5">
            {hotel.phone && (
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs">{hotel.phone}</span>
              </div>
            )}
            {hotel.email && (
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs truncate">{hotel.email}</span>
              </div>
            )}
          </div>

          {/* Inspection count */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-2 text-primary-600">
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-sm font-medium">
                {hotel._count?.inspections || 0} inspection{hotel._count?.inspections !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
