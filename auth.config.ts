/**
 * Auth.js Configuration
 *
 * Defines authentication providers and options
 * Used by both middleware (edge runtime) and API routes
 */

import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

export const authConfig: NextAuthConfig = {
  providers: [
    // Email provider using Resend (passwordless magic links)
    Resend({
      from: 'no-reply@lodgeiq.com',
    }),

    // Optional: Google OAuth provider
    // Uncomment and add credentials to .env to enable
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    // Determine which routes are protected
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/hotels') ||
                           nextUrl.pathname.startsWith('/inspections')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      // Protect dashboard routes
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/', nextUrl))
      }

      return true
    },

    // Add user role to the session
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
}
