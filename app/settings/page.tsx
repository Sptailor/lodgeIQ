/**
 * Settings Page
 *
 * User preferences and application configuration
 * Future: Profile management, notification settings, team management
 */

import { getSession } from '@/lib/auth-utils'
import { Settings as SettingsIcon, User, Bell, Shield, Users } from 'lucide-react'

export default async function SettingsPage() {
  const session = await getSession()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-3">
            <SettingsIcon className="w-7 h-7 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Settings</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage your account and application preferences
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      {session?.user && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-3">
              <User className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Name
              </label>
              <p className="text-neutral-900 dark:text-neutral-50 font-medium">
                {session.user.name || 'Not set'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Email
              </label>
              <p className="text-neutral-900 dark:text-neutral-50 font-medium">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-3">
              <Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Notifications
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Configure email and push notification preferences for inspection updates, reminders,
            and team activities.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-success-50 dark:bg-success-950/20 rounded-lg p-3">
              <Shield className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Security & Privacy
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Manage your password, two-factor authentication, and data privacy settings to keep
            your account secure.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent-50 dark:bg-accent-950/20 rounded-lg p-3">
              <Users className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Team Management
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Invite team members, assign roles and permissions, and manage inspector access to
            hotels and inspections.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
        <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p className="font-medium mb-1">LodgeIQ Hotel Inspection Platform</p>
          <p>Version 1.0.0 • Built with Next.js 14</p>
        </div>
      </div>
    </div>
  )
}
