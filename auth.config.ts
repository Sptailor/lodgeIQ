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
      const isOnApp = !nextUrl.pathname.startsWith('/auth') &&
                      nextUrl.pathname !== '/'

      // Redirect unauthenticated users to sign-in
      if (!isLoggedIn && isOnApp) {
        const signInUrl = new URL('/auth/signin', nextUrl.origin)
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return Response.redirect(signInUrl)
      }

      // Redirect authenticated users away from auth pages to home
      if (isLoggedIn && nextUrl.pathname.startsWith('/auth/signin')) {
        return Response.redirect(new URL('/', nextUrl.origin))
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
