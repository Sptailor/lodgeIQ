/**
 * SessionProvider Component
 *
 * Wraps the app with Auth.js session context
 * Makes session available to all components
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
