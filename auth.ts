/**
 * Auth.js Setup with Prisma Adapter
 *
 * Main authentication configuration
 * Connects Auth.js to Prisma database
 */

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authConfig } from './auth.config'
import { prisma } from './lib/prisma'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt', // Use JWT for serverless compatibility
  },
  callbacks: {
    ...authConfig.callbacks,
    // Customize user creation - set default role to INSPECTOR
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  // Events for logging/tracking
  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email)
      // Could send welcome email here
    },
  },
})
