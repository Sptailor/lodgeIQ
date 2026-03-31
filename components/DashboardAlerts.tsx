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
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200/80 dark:border-amber-700/50',
      icon: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-800/30',
      button: 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200/80 dark:border-red-700/50',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-800/30',
      button: 'text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-200',
    },
    slate: {
      bg: 'bg-neutral-50 dark:bg-neutral-800/50',
      border: 'border-neutral-200/80 dark:border-neutral-700/50',
      icon: 'text-neutral-600 dark:text-neutral-400',
      iconBg: 'bg-neutral-100 dark:bg-neutral-700/50',
      button: 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-200',
    },
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-2xl dark:shadow-amber-500/5">
      {/* Top accent bar with warning gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>

      {/* Ambient warning glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Alerts & Notifications
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full">
              {alertItems.length}
            </span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Items requiring your attention
          </p>
        </div>
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 rounded-xl transition-all duration-200 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30"
        >
          View All
          <ArrowRight className="w-4 h-4" />
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
                className={`group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border ${colors.bg} ${colors.border} hover:shadow-lg transition-all duration-300`}
              >
                <div className={`flex-shrink-0 rounded-xl p-3 ${colors.iconBg} ${colors.icon} ring-1 ring-inset ring-white/10`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-1 tracking-tight">{alert.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{alert.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={alert.link}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl ${colors.button} bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200`}
                  >
                    View
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-2.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
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
