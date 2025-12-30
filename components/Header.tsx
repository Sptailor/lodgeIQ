/**
 * Header Component
 *
 * App header with navigation and authentication
 * Shows user info, role badge, and sign in/out button
 */

import Link from 'next/link'
import { auth } from '@/auth'
import SignOutButton from '@/components/SignOutButton'

export default async function Header() {
  const session = await auth()

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div>
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <h1 className="text-2xl font-bold">LodgeIQ</h1>
              <p className="text-sm text-blue-100">Hotel Inspection Platform</p>
            </Link>
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                {/* User info */}
                <div className="text-right">
                  <p className="font-medium">{session.user.name || session.user.email}</p>
                  <div className="flex items-center gap-2 justify-end">
                    {/* Role badge */}
                    <span className="inline-block px-2 py-0.5 bg-blue-500 text-white rounded text-xs font-medium">
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
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
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
