/**
 * SignOutButton Component
 *
 * Client component for signing out
 * Uses Auth.js signOut action
 */

'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
    >
      Sign Out
    </button>
  )
}
