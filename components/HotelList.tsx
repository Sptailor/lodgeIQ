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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel, index) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
        >
          <Link
            href={`/hotels/${hotel.id}`}
            className="group block bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent-300 dark:hover:border-neutral-700 transition-all cursor-pointer h-full flex flex-col"
          >
            {/* Top accent bar - color coded by inspection count */}
            <div className={`h-1.5 ${hotel._count?.inspections && hotel._count.inspections > 5 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : hotel._count?.inspections && hotel._count.inspections > 0 ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 'bg-gradient-to-r from-neutral-300 to-neutral-400'}`} />

            <div className="p-6 flex-1 flex flex-col">
              {/* Hotel header with icon */}
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-2.5 shadow-sm">
                    <Building2 className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 mb-1 group-hover:text-accent-600 dark:group-hover:text-accent-500 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{hotel.city}, {hotel.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-4 flex-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">{hotel.address}</p>
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-4">
                {hotel.phone && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-1.5">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm">{hotel.phone}</span>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-1.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm truncate">{hotel.email}</span>
                  </div>
                )}
              </div>

              {/* Inspection count - more prominent */}
              <div className="pt-4 mt-auto border-t border-stone-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Inspections</span>
                  <div className="flex items-center gap-2 bg-accent-50 dark:bg-accent-950/20 px-3 py-1.5 rounded-lg">
                    <ClipboardCheck className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                    <span className="text-lg font-bold text-accent-700 dark:text-accent-400">
                      {hotel._count?.inspections || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
