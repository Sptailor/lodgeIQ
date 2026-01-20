/**
 * Loading state for Reports page
 *
 * Skeleton loaders with shimmer animation
 */

export default function ReportsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header Skeleton */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-2"></div>
        <div className="h-5 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800 rounded-xl p-6">
        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2"></div>
              <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Overview Skeleton */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg"
          >
            <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-6"></div>
            <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Tables Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg"
          >
            <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-6"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
