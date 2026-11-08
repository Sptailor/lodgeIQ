/**
 * Auth.js configuration that is safe to run in middleware (edge runtime).
 * The providers that touch the database live in auth.ts.
 */

import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    // Only the app itself is private. The landing page, the demo link and the sign in pages are public.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnApp = nextUrl.pathname === '/app' || nextUrl.pathname.startsWith('/app/')
      if (isOnApp && !isLoggedIn) {
        const signInUrl = new URL('/auth/signin', nextUrl.origin)
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return Response.redirect(signInUrl)
      }
      return true
    },

    // Keep the role and demo flag on the token and the session.
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
        token.role = user.role
        token.isDemo = user.isDemo === true
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.isDemo = token.isDemo === true
      }
      return session
    },
  },
}
