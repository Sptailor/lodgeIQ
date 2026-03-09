/**
 * HotelList Component
 *
 * Premium hotel cards with modern, travel-industry design
 * Responsive grid with smooth hover interactions and animations
 * Minimized view on mobile that expands on click
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, ClipboardCheck, Building2, ChevronDown } from 'lucide-react'
import { SearchBar } from '@/components/ui/search-bar'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get unique cities and countries for filter options
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(hotels.map((h) => h.city))).sort()
    return uniqueCities
  }, [hotels])

  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(hotels.map((h) => h.country))).sort()
    return uniqueCountries
  }, [hotels])

  // Filter hotels based on search query and filters
  const filteredHotels = useMemo(() => {
    let filtered = hotels

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.city.toLowerCase().includes(query) ||
          hotel.country.toLowerCase().includes(query) ||
          hotel.address.toLowerCase().includes(query)
      )
    }

    // Apply city filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter((hotel) => hotel.city === selectedCity)
    }

    // Apply country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter((hotel) => hotel.country === selectedCountry)
    }

    return filtered
  }, [hotels, searchQuery, selectedCity, selectedCountry])

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
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search hotels by name, city, country, or address..."
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {/* City Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Filter by Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="px-4 py-2.5 bg-accent-50 dark:bg-accent-900/20 rounded-xl border border-accent-200/50 dark:border-accent-700/30">
              <p className="text-sm font-semibold text-accent-700 dark:text-accent-300 whitespace-nowrap">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-br from-white to-primary-50/30 dark:from-neutral-800/40 dark:to-neutral-900/40 dark:backdrop-blur-xl rounded-lg border border-primary-200/60 dark:border-primary-800/30 shadow-soft"
        >
          <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-800/40 rounded-lg flex items-center justify-center mb-4 ring-1 ring-primary-200/50 dark:ring-primary-700/30">
            <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-300" />
          </div>
          <p className="text-base font-bold text-neutral-900 dark:text-white mb-2">No properties found</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            Try adjusting your search criteria
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHotels.map((hotel, index) => {
        const isExpanded = expandedId === hotel.id

        return (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            <div
              className="group relative block bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl md:hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col"
            >
              {/* Top accent bar - dynamic gradient based on inspection count */}
              <div className={`h-1 ${hotel._count?.inspections && hotel._count.inspections > 5 ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500' : hotel._count?.inspections && hotel._count.inspections > 0 ? 'bg-gradient-to-r from-accent-500 via-teal-500 to-accent-500' : 'bg-gradient-to-r from-neutral-400 via-neutral-500 to-neutral-400'}`} />

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center shadow-lg md:transition-transform md:group-hover:scale-110 md:group-hover:rotate-3">
                    <Building2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white mb-1 md:mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                      <span className="text-xs md:text-sm font-semibold">{hotel.city}, {hotel.country}</span>
                    </div>
                  </div>
                  {/* Mobile expand indicator */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
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
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs md:text-sm font-medium">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs md:text-sm font-medium truncate">{hotel.email}</span>
                    </div>
                  )}
                </div>

                {/* Inspection count - prominent badge */}
                <div className="pt-4 md:pt-5 mt-auto border-t border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Inspections</span>
                    <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-teal-200/50 dark:border-teal-700/30">
                      <ClipboardCheck className="w-4 h-4 md:w-5 md:h-5 text-teal-600 dark:text-teal-400" />
                      <span className="text-lg md:text-xl font-bold text-teal-700 dark:text-teal-300">
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
                  className="mt-4 w-full block text-center bg-gradient-to-r from-accent-500 to-teal-500 hover:from-accent-600 hover:to-teal-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
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
      )}
    </div>
  )
}
