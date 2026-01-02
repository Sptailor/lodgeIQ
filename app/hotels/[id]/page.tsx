/**
 * Hotel Detail Page - Enhanced with Hero Header
 *
 * Premium hotel information display with gradient hero section
 * Shows hotel information and inspection history with modern design
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StartInspectionButton from '@/components/StartInspectionButton'
import InspectionHistory from '@/components/InspectionHistory'
import { MapPin, Phone, Mail, Globe, Building2, ChevronLeft } from 'lucide-react'

interface PageProps {
  params: {
    id: string
  }
}

/**
 * Fetch hotel with inspections on the server
 */
async function getHotel(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      inspections: {
        orderBy: { inspectionDate: 'desc' },
        include: {
          inspector: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { inspectionResults: true },
          },
        },
      },
    },
  })

  return hotel
}

export default async function HotelDetailPage({ params }: PageProps) {
  const hotel = await getHotel(params.id)

  if (!hotel) {
    notFound()
  }

  // Calculate statistics
  const totalInspections = hotel.inspections.length
  const completedInspections = hotel.inspections.filter(
    (i) => i.status === 'COMPLETED' || i.status === 'APPROVED'
  ).length
  const avgRating = hotel.inspections
    .filter((i) => i.overallRating !== null)
    .reduce((sum, i) => sum + (i.overallRating || 0), 0) / (hotel.inspections.filter((i) => i.overallRating !== null).length || 1)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Hero Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-tertiary-600 dark:from-primary-700 dark:to-tertiary-700 rounded-2xl p-8 shadow-soft-2xl">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-2 text-primary-100 dark:text-primary-200">
                    <MapPin className="w-4 h-4" />
                    <span className="text-lg">{hotel.city}, {hotel.country}</span>
                  </div>
                </div>
              </div>

              {hotel.description && (
                <p className="text-primary-100 dark:text-primary-200 text-lg leading-relaxed max-w-3xl">
                  {hotel.description}
                </p>
              )}
            </div>

            {/* Start inspection button */}
            <div className="flex-shrink-0">
              <StartInspectionButton hotelId={hotel.id} hotelName={hotel.name} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Total Inspections</p>
              <p className="text-3xl font-bold text-white">{totalInspections}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-xs text-primary-200 mb-1">Completed</p>
              <p className="text-3xl font-bold text-white">{completedInspections}</p>
            </div>
            {avgRating > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-xs text-primary-200 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-white">{avgRating.toFixed(1)}/5</p>
              </div>
            )}
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Contact Information Card */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 pb-3 border-b-2 border-neutral-200 dark:border-neutral-800">
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Address</p>
            <p className="text-neutral-900 dark:text-neutral-50 font-medium">{hotel.address}</p>
          </div>

          {hotel.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Phone</p>
                <a 
                  href={`tel:${hotel.phone}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  {hotel.phone}
                </a>
              </div>
            </div>
          )}

          {hotel.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Email</p>
                <a 
                  href={`mailto:${hotel.email}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium truncate block"
                >
                  {hotel.email}
                </a>
              </div>
            </div>
          )}

          {hotel.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Website</p>
                <a 
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium truncate block"
                >
                  {hotel.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspection history */}
      <InspectionHistory inspections={hotel.inspections} />
    </div>
  )
}
