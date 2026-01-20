/**
 * Dashboard - High-level summary metrics and recent activity
 */

import { prisma } from '@/lib/prisma'
import { KPICard } from '@/components/ui/kpi-card'
import { DashboardAlerts } from '@/components/DashboardAlerts'
import Link from 'next/link'

async function getDashboardMetrics() {
  try {
    const totalHotels = await prisma.hotel.count()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    // Recent inspections (last 30 days)
    const recentInspections = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Previous period inspections (30-60 days ago)
    const previousInspections = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    })

    const completedInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
      },
    })

    // Previous completed inspections for trend
    const previousCompleted = await prisma.inspection.count({
      where: {
        status: {
          in: ['COMPLETED', 'APPROVED'],
        },
        inspectionDate: {
          lt: thirtyDaysAgo,
        },
      },
    })

    const pendingInspections = await prisma.inspection.count({
      where: {
        status: {
          not: {
            in: ['COMPLETED', 'APPROVED'],
          },
        },
      },
    })

    // Recent ratings (last 30 days)
    const recentRatings = await prisma.inspection.findMany({
      where: {
        overallRating: {
          not: null,
        },
        inspectionDate: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        overallRating: true,
      },
    })

    // Previous ratings (30-60 days ago)
    const previousRatings = await prisma.inspection.findMany({
      where: {
        overallRating: {
          not: null,
        },
        inspectionDate: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      select: {
        overallRating: true,
      },
    })

    const avgRating =
      recentRatings.length > 0
        ? recentRatings.reduce((sum, i) => sum + (i.overallRating || 0), 0) / recentRatings.length
        : 0

    const previousAvgRating =
      previousRatings.length > 0
        ? previousRatings.reduce((sum, i) => sum + (i.overallRating || 0), 0) / previousRatings.length
        : 0

    // Calculate trends
    const inspectionsTrend =
      previousInspections > 0 ? ((recentInspections - previousInspections) / previousInspections) * 100 : 0

    const completedTrend =
      previousCompleted > 0 ? ((completedInspections - previousCompleted) / previousCompleted) * 100 : 0

    const ratingTrend = previousAvgRating > 0 ? ((avgRating - previousAvgRating) / previousAvgRating) * 100 : 0

    return {
      totalHotels,
      recentInspections,
      completedInspections,
      pendingInspections,
      avgRating,
      inspectionsTrend,
      completedTrend,
      ratingTrend,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      totalHotels: 0,
      recentInspections: 0,
      completedInspections: 0,
      pendingInspections: 0,
      avgRating: 0,
      inspectionsTrend: 0,
      completedTrend: 0,
      ratingTrend: 0,
    }
  }
}

async function getRecentActivity() {
  try {
    const recentInspections = await prisma.inspection.findMany({
      take: 5,
      orderBy: {
        inspectionDate: 'desc',
      },
      include: {
        hotel: {
          select: {
            name: true,
          },
        },
      },
    })

    return recentInspections
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

async function getAlerts() {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Pending inspections
    const pendingInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'REJECTED'],
        },
      },
    })

    // Low ratings in last 7 days
    const lowRatings = await prisma.inspection.count({
      where: {
        inspectionDate: {
          gte: sevenDaysAgo,
        },
        overallRating: {
          lt: 3.0,
        },
      },
    })

    // Hotels without recent inspections (no inspection in last 30 days)
    const allHotels = await prisma.hotel.count()
    const hotelsWithRecentInspections = await prisma.hotel.count({
      where: {
        inspections: {
          some: {
            inspectionDate: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    })
    const hotelsWithoutRecentInspections = allHotels - hotelsWithRecentInspections

    return {
      pendingInspections,
      lowRatings,
      hotelsWithoutRecentInspections,
    }
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return {
      pendingInspections: 0,
      lowRatings: 0,
      hotelsWithoutRecentInspections: 0,
    }
  }
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()
  const alerts = await getAlerts()
  const recentActivity = await getRecentActivity()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-tertiary-500 to-accent-500"></div>
        <div className="hidden sm:block absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-primary-100 to-tertiary-100 dark:from-primary-900/20 dark:to-tertiary-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="hidden sm:block absolute -left-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-accent-100 to-primary-100 dark:from-accent-900/20 dark:to-primary-900/20 rounded-full blur-2xl opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 sm:mb-3">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-base md:text-lg">
            High-level overview of your operations
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Hotels"
          value={metrics.totalHotels}
          icon="building"
          variant="primary"
          subtitle="Properties managed"
        />
        <KPICard
          title="Inspections"
          value={metrics.recentInspections}
          icon="clipboard"
          variant="default"
          subtitle="Last 30 days"
          trend={{
            value: Number(Math.abs(metrics.inspectionsTrend).toFixed(1)),
            label: 'vs previous period',
            direction: metrics.inspectionsTrend > 0 ? 'up' : metrics.inspectionsTrend < 0 ? 'down' : 'neutral',
          }}
        />
        <KPICard
          title="Completed"
          value={metrics.completedInspections}
          icon="check-circle"
          variant="success"
          subtitle="Total completed"
          trend={{
            value: Number(Math.abs(metrics.completedTrend).toFixed(1)),
            label: 'vs previous period',
            direction: metrics.completedTrend > 0 ? 'up' : metrics.completedTrend < 0 ? 'down' : 'neutral',
          }}
        />
        <KPICard
          title="Avg Rating"
          value={metrics.avgRating > 0 ? metrics.avgRating.toFixed(1) : 'N/A'}
          icon="trending-up"
          variant={metrics.avgRating >= 4 ? 'success' : metrics.avgRating >= 3 ? 'warning' : 'danger'}
          subtitle="Overall rating"
          trend={
            metrics.avgRating > 0
              ? {
                  value: Math.abs(metrics.ratingTrend),
                  label: 'vs previous period',
                  direction: metrics.ratingTrend > 0 ? 'up' : metrics.ratingTrend < 0 ? 'down' : 'neutral',
                }
              : undefined
          }
        />
      </div>

      {/* Alerts & Notifications */}
      <DashboardAlerts alerts={alerts} />

      {/* Recent Activity Feed */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border-2 border-white/20 dark:border-neutral-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-lg">
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Recent Activity
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Latest inspection activity across all properties
            </p>
          </div>
          <Link
            href="/reports"
            className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">No recent activity</p>
          ) : (
            recentActivity.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {inspection.hotel.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inspection.overallRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {inspection.overallRating.toFixed(1)}
                      </span>
                      <span className="text-amber-500">★</span>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inspection.status === 'COMPLETED' || inspection.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : inspection.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {inspection.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
