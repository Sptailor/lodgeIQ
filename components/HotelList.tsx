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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
      >
        <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-3">
          <Building2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-1">No hotels yet</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Add your first property to get started
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
        >
          <Link
            href={`/hotels/${hotel.id}`}
            className="group block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer h-full"
          >
            {/* Hotel header */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-500 transition-colors">
                {hotel.name}
              </h3>
              <div className="flex items-start gap-1.5 text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{hotel.city}, {hotel.country}</span>
              </div>
            </div>

            {/* Address */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2 leading-relaxed">{hotel.address}</p>

            {/* Contact info */}
            <div className="space-y-1.5 mb-4">
              {hotel.phone && (
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs">{hotel.phone}</span>
                </div>
              )}
              {hotel.email && (
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs truncate">{hotel.email}</span>
                </div>
              )}
            </div>

            {/* Inspection count */}
            <div className="pt-3 mt-auto border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Inspections</span>
                <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">
                    {hotel._count?.inspections || 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
