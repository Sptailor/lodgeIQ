/**
 * Database seed.
 * Replaces the sample portfolio with fresh, relative-dated data.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import { resetSampleData } from '../lib/seed/sample-seed'

const prisma = new PrismaClient()

// Hotels and people created by the first version of the seed, before the redesign.
const LEGACY_HOTELS = [
  'Grand Palace Hotel',
  'Sunset Beach Resort',
  'Mountain View Lodge',
  'Tokyo Imperial Suites',
  'Sydney Harbor Hotel',
  'London Westminster Inn',
  'Dubai Marina Resort',
  'New York Central Plaza',
  'Barcelona Beach Club',
  'Singapore Sky Tower',
]
const LEGACY_USERS = [
  'john.doe@lodgeiq.com',
  'john.davis@lodgeiq.com',
  'sarah.wilson@lodgeiq.com',
  'michael.chen@lodgeiq.com',
  'emma.johnson@lodgeiq.com',
  'david.martinez@lodgeiq.com',
  'lisa.anderson@lodgeiq.com',
  'robert.taylor@lodgeiq.com',
]

async function main() {
  console.log('Seeding LodgeIQ sample data...')

  // Remove the old sample data (safe to run again).
  const oldHotels = await prisma.hotel.deleteMany({ where: { isSample: false, name: { in: LEGACY_HOTELS } } })
  await prisma.inspection.deleteMany({ where: { inspector: { email: { in: LEGACY_USERS } } } })
  const oldUsers = await prisma.user.deleteMany({ where: { email: { in: LEGACY_USERS } } })
  if (oldHotels.count || oldUsers.count) {
    console.log(`Removed ${oldHotels.count} old hotels and ${oldUsers.count} old users`)
  }

  const counts = await resetSampleData(prisma)
  console.log('Created:', counts)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
