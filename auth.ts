/**
 * Auth.js setup with the Prisma adapter.
 *
 * Sign in options:
 * - "demo": one click sign in as the sample operations manager (no password).
 * - Email magic link through Resend, only when AUTH_RESEND_KEY is set.
 * - Google, only when both Google variables are set.
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authConfig } from './auth.config'
import { prisma } from './lib/prisma'

export const DEMO_EMAIL = 'demo@lodgeiq.app'

export const hasEmailSignIn = !!process.env.AUTH_RESEND_KEY
export const hasGoogleSignIn = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt', // Needed for the demo sign in, and good for serverless
  },
  providers: [
    Credentials({
      id: 'demo',
      name: 'Demo',
      credentials: {},
      async authorize() {
        const user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })
        if (!user || !user.isDemo) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role, isDemo: true }
      },
    }),
    ...(hasEmailSignIn ? [Resend({ from: 'no-reply@lodgeiq.com' })] : []),
    ...(hasGoogleSignIn
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
})
