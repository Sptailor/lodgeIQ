'use client'

interface GeographicMapProps {
  hotels: Array<{
    id: string
    name: string
    city: string
    country: string
    inspectionCount: number
    avgRating: number
  }>
}

export function GeographicMap({ hotels }: GeographicMapProps) {
  return (
    <div className="space-y-4">
      {/* Map Placeholder - Future enhancement: integrate with map library */}
      <div className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Interactive map view coming soon
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            {hotels.length} hotels across {new Set(hotels.map(h => h.country)).size} countries
          </p>
        </div>
      </div>

      {/* Hotel Location List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">
                  {hotel.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  📍 {hotel.city}, {hotel.country}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {hotel.avgRating > 0 ? hotel.avgRating.toFixed(1) : 'N/A'}
                  </span>
                  {hotel.avgRating > 0 && <span className="text-amber-500 text-xs">★</span>}
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-500">
                  {hotel.inspectionCount} inspections
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
