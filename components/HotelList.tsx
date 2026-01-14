/**
 * HotelList Component
 *
 * Premium hotel cards with modern, travel-industry design
 * Responsive grid with smooth hover interactions and animations
 * Minimized view on mobile that expands on click
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, ClipboardCheck, Building2, ChevronDown } from 'lucide-react'

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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (hotels.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-800/40 dark:to-neutral-900/40 dark:backdrop-blur-xl rounded-lg border border-primary-200/60 dark:border-primary-800/30 shadow-soft"
      >
        <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-800/40 rounded-lg flex items-center justify-center mb-4 ring-1 ring-primary-200/50 dark:ring-primary-700/30">
          <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-300" />
        </div>
        <p className="text-base font-bold text-neutral-900 dark:text-white mb-2">No properties yet</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
          Add your first property to start tracking inspections
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel, index) => {
        const isExpanded = expandedId === hotel.id

        return (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            <div
              className="group block bg-gradient-to-br from-white via-white to-accent-50/30 dark:from-neutral-800/60 dark:via-neutral-850/50 dark:to-accent-950/20 dark:backdrop-blur-xl border border-accent-200/40 dark:border-accent-800/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-accent-400/60 dark:hover:border-accent-600/50 md:hover:scale-[1.01] transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
              {/* Top accent bar - warm gradient with shimmer */}
              <div className={`h-2 ${hotel._count?.inspections && hotel._count.inspections > 5 ? 'bg-gradient-to-r from-success-500 via-success-600 to-emerald-600' : hotel._count?.inspections && hotel._count.inspections > 0 ? 'bg-gradient-to-r from-accent-500 via-accent-600 to-gold-600' : 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600'}`} />

            <div className="p-4 md:p-6 flex-1 flex flex-col">
              {/* Hotel header with icon - clickable on mobile */}
              <div
                className="mb-3 md:mb-5 md:cursor-default cursor-pointer"
                onClick={(e) => {
                  if (isMobile) {
                    e.preventDefault()
                    e.stopPropagation()
                    setExpandedId(isExpanded ? null : hotel.id)
                  }
                }}
              >
                <div className="flex items-start gap-3 md:gap-4 mb-3">
                  <div className="bg-accent-100 dark:bg-accent-900/50 rounded-xl p-2 md:p-3 shadow-soft ring-1 ring-accent-200/50 dark:ring-accent-800/30 md:transition-transform md:group-hover:scale-110 md:group-hover:rotate-3">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-accent-700 dark:text-accent-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white mb-1 md:mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-semibold">{hotel.city}, {hotel.country}</span>
                    </div>
                  </div>
                  {/* Mobile expand indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden"
                  >
                    <ChevronDown className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                  </motion.div>
                </div>
              </div>

              {/* Expandable content on mobile, always shown on desktop */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded || !isMobile ? 'auto' : 0,
                  opacity: isExpanded || !isMobile ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden md:!h-auto md:!opacity-100"
              >
                {/* Address */}
                <div className="mb-4 flex-1">
                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">{hotel.address}</p>
                </div>

                {/* Contact info */}
                <div className="space-y-2.5 mb-5">
                  {hotel.phone && (
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <div className="bg-primary-100 dark:bg-primary-800/30 rounded-lg p-2 ring-1 ring-primary-200/50 dark:ring-primary-700/20">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary-700 dark:text-primary-300" />
                      </div>
                      <span className="text-xs md:text-sm font-medium">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <div className="bg-primary-100 dark:bg-primary-800/30 rounded-lg p-2 ring-1 ring-primary-200/50 dark:ring-primary-700/20">
                        <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary-700 dark:text-primary-300" />
                      </div>
                      <span className="text-xs md:text-sm font-medium truncate">{hotel.email}</span>
                    </div>
                  )}
                </div>

                {/* Inspection count - prominent badge */}
                <div className="pt-4 md:pt-5 mt-auto border-t border-accent-200/40 dark:border-accent-800/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">Inspections</span>
                    <div className="flex items-center gap-2 md:gap-2.5 bg-gradient-to-br from-accent-100 to-accent-50 dark:from-accent-900/50 dark:to-accent-950/30 px-3 md:px-4 py-1.5 md:py-2 rounded-xl ring-1 ring-accent-200/60 dark:ring-accent-700/40 shadow-soft">
                      <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 text-accent-700 dark:text-accent-200" />
                      <span className="text-lg md:text-xl font-bold text-accent-800 dark:text-accent-200">
                        {hotel._count?.inspections || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* View Details Link - Only shown when expanded or on desktop */}
              {(isExpanded || !isMobile) && (
                <Link
                  href={`/hotels/${hotel.id}`}
                  className="mt-4 w-full block text-center bg-accent-600 hover:bg-accent-700 dark:bg-accent-700 dark:hover:bg-accent-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </motion.div>
        )
      })}
    </div>
  )
}
