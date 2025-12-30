/**
 * Default Inspector Utility
 *
 * Since we don't have authentication yet, we use a hardcoded inspector
 * In STEP 3, this will be replaced with actual user authentication
 */

import { prisma } from './prisma'

/**
 * Gets the default inspector user (John Doe)
 * This is a temporary solution until authentication is implemented
 */
export async function getDefaultInspector() {
  const inspector = await prisma.user.findUnique({
    where: { email: 'john.doe@lodgeiq.com' },
  })

  if (!inspector) {
    throw new Error('Default inspector not found. Please run: npx prisma db seed')
  }

  return inspector
}
