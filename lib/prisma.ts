/**
 * Prisma Client Singleton
 *
 * This file ensures we only instantiate Prisma Client once in development
 * to avoid connection pool exhaustion during hot reloads in Next.js
 */

import { PrismaClient } from '@prisma/client'

// Extend the global type to include our prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a single Prisma Client instance
// In development, we store it on the global object to persist across hot reloads
// In production, we create a new instance each time
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Store the instance globally in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
