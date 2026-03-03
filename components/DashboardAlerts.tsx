'use client'

/**
 * DashboardAlerts Component
 *
 * Displays dismissible alerts with slide-in animation
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Clock, Calendar, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface AlertsData {
  pendingInspections: number
  lowRatings: number
  hotelsWithoutRecentInspections: number
}

interface DashboardAlertsProps {
  alerts: AlertsData
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId))
  }

  const alertItems = [
    {
      id: 'pending',
      show: alerts.pendingInspections > 0,
      icon: Clock,
      title: `${alerts.pendingInspections} Pending Inspections`,
      description: 'Inspections require attention to complete',
      color: 'amber',
      link: '/reports?statuses=IN_PROGRESS,REJECTED',
    },
    {
      id: 'low-ratings',
      show: alerts.lowRatings > 0,
      icon: AlertTriangle,
      title: `${alerts.lowRatings} Low Ratings`,
      description: 'Properties with ratings below 3.0 in last 7 days',
      color: 'red',
      link: '/reports?dateFrom=' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    {
      id: 'no-recent',
      show: alerts.hotelsWithoutRecentInspections > 0,
      icon: Calendar,
      title: `${alerts.hotelsWithoutRecentInspections} Hotels Overdue`,
      description: 'No inspections in last 30 days',
      color: 'slate',
      link: '/hotels',
    },
  ].filter((alert) => alert.show && !dismissedAlerts.has(alert.id))

  if (alertItems.length === 0) {
    return null
  }

  const colorClasses = {
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-500/30',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      button: 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-500/10',
      border: 'border-red-200 dark:border-red-500/30',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-500/20',
      button: 'text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200',
    },
    slate: {
      bg: 'bg-primary-50 dark:bg-primary-500/10',
      border: 'border-primary-200 dark:border-primary-500/30',
      icon: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-100 dark:bg-primary-500/20',
      button: 'text-primary-700 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200',
    },
  }

  return (
    <div className="bg-white dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 rounded-xl p-5 sm:p-7 shadow-sm">
      <div className="mb-5 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-primary-900 dark:text-white mb-2">
            Alerts & Notifications
          </h2>
          <p className="text-xs sm:text-sm text-primary-500 dark:text-primary-400">
            Items requiring your attention
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
        <AnimatePresence mode="popLayout">
          {alertItems.slice(0, 5).map((alert, index) => {
            const Icon = alert.icon
            const colors = colorClasses[alert.color as keyof typeof colorClasses]

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative flex items-start gap-4 p-4 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200`}
              >
                <div className={`flex-shrink-0 rounded-lg p-2.5 ${colors.iconBg} ${colors.icon}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-primary-900 dark:text-white mb-1">{alert.title}</h3>
                  <p className="text-sm text-primary-600 dark:text-primary-300">{alert.description}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={alert.link}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg ${colors.button} bg-white dark:bg-primary-800 hover:bg-primary-50 dark:hover:bg-primary-700 border border-primary-200 dark:border-primary-600 transition-all duration-200`}
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2 rounded-lg text-primary-400 hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700 transition-all duration-200"
                    aria-label="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
