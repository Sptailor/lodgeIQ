/**
 * Database Seed Script
 *
 * Run this to populate your database with sample data for testing
 * Usage: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users (upsert to make idempotent)
  const inspector1 = await prisma.user.upsert({
    where: { email: 'john.doe@lodgeiq.com' },
    update: {},
    create: {
      email: 'john.doe@lodgeiq.com',
      name: 'John Doe',
      role: 'INSPECTOR',
    },
  })

  const inspector2 = await prisma.user.upsert({
    where: { email: 'jane.smith@lodgeiq.com' },
    update: {},
    create: {
      email: 'jane.smith@lodgeiq.com',
      name: 'Jane Smith',
      role: 'INSPECTOR',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@lodgeiq.com' },
    update: {},
    create: {
      email: 'manager@lodgeiq.com',
      name: 'Sarah Manager',
      role: 'MANAGER',
    },
  })

  console.log('✅ Created users')

  // Create sample hotels
  const hotel1 = await prisma.hotel.create({
    data: {
      name: 'Grand Palace Hotel',
      address: '123 Royal Street',
      city: 'Paris',
      country: 'France',
      phone: '+33 1 23 45 67 89',
      email: 'info@grandpalace.fr',
      website: 'https://grandpalace.fr',
      description: 'Luxury 5-star hotel in the heart of Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    },
  })

  const hotel2 = await prisma.hotel.create({
    data: {
      name: 'Sunset Beach Resort',
      address: '456 Ocean Drive',
      city: 'Miami',
      country: 'USA',
      phone: '+1 305 123 4567',
      email: 'reservations@sunsetbeach.com',
      website: 'https://sunsetbeach.com',
      description: 'Beachfront resort with stunning ocean views',
      latitude: 25.7617,
      longitude: -80.1918,
    },
  })

  const hotel3 = await prisma.hotel.create({
    data: {
      name: 'Mountain View Lodge',
      address: '789 Alpine Road',
      city: 'Zurich',
      country: 'Switzerland',
      phone: '+41 44 123 45 67',
      email: 'info@mountainview.ch',
      description: 'Cozy lodge with spectacular mountain views',
      latitude: 47.3769,
      longitude: 8.5417,
    },
  })

  console.log('✅ Created hotels')

  // Create standard checklist items (only if none exist)
  const existingItems = await prisma.checklistItem.count()
  if (existingItems === 0) {
    await prisma.checklistItem.createMany({
      data: [
      // Room Quality
      {
        category: 'Room Quality',
        itemName: 'Bed Comfort',
        description: 'Check mattress quality, pillows, and bedding',
        weight: 1.5,
        order: 1,
      },
      {
        category: 'Room Quality',
        itemName: 'Room Size',
        description: 'Adequate space for guests and luggage',
        weight: 1.0,
        order: 2,
      },
      {
        category: 'Room Quality',
        itemName: 'Air Conditioning/Heating',
        description: 'Temperature control functionality',
        weight: 1.5,
        order: 3,
      },
      // Cleanliness
      {
        category: 'Cleanliness',
        itemName: 'Bathroom Cleanliness',
        description: 'Check toilet, shower, sink, and floors',
        weight: 2.0,
        order: 1,
      },
      {
        category: 'Cleanliness',
        itemName: 'Room Cleanliness',
        description: 'Overall room hygiene and tidiness',
        weight: 1.5,
        order: 2,
      },
      {
        category: 'Cleanliness',
        itemName: 'Linen Quality',
        description: 'Clean, fresh sheets and towels',
        weight: 1.5,
        order: 3,
      },
      // Safety
      {
        category: 'Safety',
        itemName: 'Fire Safety Equipment',
        description: 'Check smoke detectors, fire extinguishers, exits',
        weight: 2.0,
        order: 1,
      },
      {
        category: 'Safety',
        itemName: 'Door Locks',
        description: 'Secure locks and peephole functionality',
        weight: 1.5,
        order: 2,
      },
      {
        category: 'Safety',
        itemName: 'Emergency Information',
        description: 'Visible emergency exits and contact info',
        weight: 1.0,
        order: 3,
      },
      // Amenities
      {
        category: 'Amenities',
        itemName: 'WiFi Quality',
        description: 'Internet speed and reliability',
        weight: 1.5,
        order: 1,
      },
      {
        category: 'Amenities',
        itemName: 'TV and Entertainment',
        description: 'TV functionality and channel selection',
        weight: 0.5,
        order: 2,
      },
      {
        category: 'Amenities',
        itemName: 'Bathroom Amenities',
        description: 'Toiletries, hair dryer, etc.',
        weight: 1.0,
        order: 3,
      },
      // Staff & Service
      {
        category: 'Staff & Service',
        itemName: 'Check-in Process',
        description: 'Efficiency and friendliness at reception',
        weight: 1.5,
        order: 1,
      },
      {
        category: 'Staff & Service',
        itemName: 'Staff Responsiveness',
        description: 'Staff availability and helpfulness',
        weight: 1.5,
        order: 2,
      },
      {
        category: 'Staff & Service',
        itemName: 'Language Skills',
        description: 'Staff ability to communicate in required languages',
        weight: 1.0,
        order: 3,
      },
      ],
    })
    console.log('✅ Created 15 standard checklist items')
  } else {
    console.log('✅ Checklist items already exist, skipping')
  }

  // Note: Inspections will be created through the UI in STEP 2
  console.log('✅ Skipping sample inspection (will be created via UI)')

  console.log('🎉 Seed completed successfully!')
  console.log(`
  Created:
  - 3 users (2 inspectors, 1 manager)
  - 3 hotels (Paris, Miami, Zurich)
  - 15 standard checklist items across 5 categories
  - Ready for STEP 2: Inspection Workflow
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
