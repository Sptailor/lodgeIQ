/**
 * HotelList Component
 *
 * Premium hotel cards with modern, travel-industry design
 * Responsive grid with smooth hover interactions and animations
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-soft"
      >
        <div className="w-16 h-16 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
        </div>
        <p className="text-neutral-900 dark:text-neutral-50 text-lg font-medium mb-1">No hotels yet</p>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Add your first hotel using the form above
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <Link
            href={`/hotels/${hotel.id}`}
            className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-soft-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer h-full"
          >
            {/* Hotel header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-start gap-1.5 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{hotel.city}, {hotel.country}</span>
              </div>
            </div>

            {/* Address */}
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-2">{hotel.address}</p>

            {/* Contact info */}
            <div className="space-y-2 mb-5">
              {hotel.phone && (
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs">{hotel.phone}</span>
                </div>
              )}
              {hotel.email && (
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-xs truncate">{hotel.email}</span>
                </div>
              )}
            </div>

            {/* Inspection count */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                <ClipboardCheck className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {hotel._count?.inspections || 0} inspection{hotel._count?.inspections !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
