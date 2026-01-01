/**
 * Header Component
 *
 * Professional app header with navigation and authentication
 * Clean, travel-industry inspired design with user context
 *
 * AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
 * Uses mock session from auth-utils
 */

import Link from 'next/link'
import { getSession } from '@/lib/auth-utils'
import { Building2, User } from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'

export default async function Header() {
  const session = await getSession()

  return (
    <header className="bg-white border-b border-neutral-200 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary-500 rounded-xl p-2 group-hover:bg-primary-600 transition-colors">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                LodgeIQ
              </h1>
              <p className="text-xs text-neutral-500 hidden sm:block">Hotel Inspection Platform</p>
            </div>
          </Link>

          {/* Auth section */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                {/* User info */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-700" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">
                      {session.user.name || session.user.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                      {session.user.role}
                    </span>
                  </div>
                </div>

                {/* Sign out button */}
                <SignOutButton />
              </>
            ) : (
              /* Sign in link */
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-soft"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
