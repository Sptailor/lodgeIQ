/**
 * Database Seed Script
 *
 * Run this to populate your database with sample data for testing
 * Usage: npx prisma db seed
 */

import { PrismaClient, InspectionStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to generate random date in past 12 months
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper to generate random rating
function randomRating(min: number = 1, max: number = 5): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.inspectionResult.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.checklistItem.deleteMany()
  await prisma.user.deleteMany()

  // Create 7 inspectors (2 highly active, 5 normal)
  const inspectorData = [
    { name: 'John Davis', email: 'john.davis@lodgeiq.com', active: true },
    { name: 'Sarah Wilson', email: 'sarah.wilson@lodgeiq.com', active: true },
    { name: 'Michael Chen', email: 'michael.chen@lodgeiq.com', active: false },
    { name: 'Emma Johnson', email: 'emma.johnson@lodgeiq.com', active: false },
    { name: 'David Martinez', email: 'david.martinez@lodgeiq.com', active: false },
    { name: 'Lisa Anderson', email: 'lisa.anderson@lodgeiq.com', active: false },
    { name: 'Robert Taylor', email: 'robert.taylor@lodgeiq.com', active: false },
  ]

  const inspectors = await Promise.all(
    inspectorData.map((data) =>
      prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: 'INSPECTOR',
        },
      })
    )
  )

  console.log('✅ Created 7 inspectors')

  // Create 10 hotels with geographic diversity
  const hotelData = [
    {
      name: 'Grand Palace Hotel',
      address: '123 Royal Street',
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3522,
      phone: '+33 1 23 45 67 89',
      type: 'at-risk',
      pendingIssues: true,
    },
    {
      name: 'Sunset Beach Resort',
      address: '456 Ocean Drive',
      city: 'Miami',
      country: 'USA',
      latitude: 25.7617,
      longitude: -80.1918,
      phone: '+1 305 123 4567',
      type: 'top-performer',
      pendingIssues: false,
    },
    {
      name: 'Mountain View Lodge',
      address: '789 Alpine Road',
      city: 'Zurich',
      country: 'Switzerland',
      latitude: 47.3769,
      longitude: 8.5417,
      phone: '+41 44 123 45 67',
      type: 'top-performer',
      pendingIssues: false,
    },
    {
      name: 'Tokyo Imperial Suites',
      address: '12 Ginza Avenue',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      phone: '+81 3 1234 5678',
      type: 'at-risk',
      pendingIssues: true,
    },
    {
      name: 'Sydney Harbor Hotel',
      address: '88 Harbour Street',
      city: 'Sydney',
      country: 'Australia',
      latitude: -33.8688,
      longitude: 151.2093,
      phone: '+61 2 1234 5678',
      type: 'normal',
      pendingIssues: false,
    },
    {
      name: 'London Westminster Inn',
      address: '34 Westminster Road',
      city: 'London',
      country: 'UK',
      latitude: 51.5074,
      longitude: -0.1278,
      phone: '+44 20 1234 5678',
      type: 'declining',
      pendingIssues: false,
    },
    {
      name: 'Dubai Marina Resort',
      address: '567 Marina Walk',
      city: 'Dubai',
      country: 'UAE',
      latitude: 25.0760,
      longitude: 55.1380,
      phone: '+971 4 123 4567',
      type: 'at-risk',
      pendingIssues: true,
    },
    {
      name: 'New York Central Plaza',
      address: '901 Fifth Avenue',
      city: 'New York',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
      phone: '+1 212 123 4567',
      type: 'normal',
      pendingIssues: false,
    },
    {
      name: 'Barcelona Beach Club',
      address: '45 La Rambla',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3851,
      longitude: 2.1734,
      phone: '+34 93 123 4567',
      type: 'bottom-performer',
      pendingIssues: false,
    },
    {
      name: 'Singapore Sky Tower',
      address: '78 Orchard Road',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
      phone: '+65 6123 4567',
      type: 'bottom-performer',
      pendingIssues: false,
    },
  ]

  const hotels = await Promise.all(
    hotelData.map((data) =>
      prisma.hotel.create({
        data: {
          name: data.name,
          address: data.address,
          city: data.city,
          country: data.country,
          phone: data.phone,
          email: `info@${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      })
    )
  )

  console.log('✅ Created 10 hotels')

  // Create checklist items
  await prisma.checklistItem.createMany({
    data: [
      // Cleanliness
      { category: 'Cleanliness', itemName: 'Bathroom Cleanliness', weight: 2.0, order: 1 },
      { category: 'Cleanliness', itemName: 'Room Cleanliness', weight: 1.5, order: 2 },
      { category: 'Cleanliness', itemName: 'Linen Quality', weight: 1.5, order: 3 },
      // Safety
      { category: 'Safety', itemName: 'Fire Safety Equipment', weight: 2.0, order: 1 },
      { category: 'Safety', itemName: 'Door Locks', weight: 1.5, order: 2 },
      { category: 'Safety', itemName: 'Emergency Information', weight: 1.0, order: 3 },
      // Amenities
      { category: 'Amenities', itemName: 'WiFi Quality', weight: 1.5, order: 1 },
      { category: 'Amenities', itemName: 'TV and Entertainment', weight: 0.5, order: 2 },
      { category: 'Amenities', itemName: 'Bathroom Amenities', weight: 1.0, order: 3 },
    ],
  })

  console.log('✅ Created checklist items')

  // Generate 150 inspections with realistic patterns
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 12)
  const endDate = new Date()
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const statuses: InspectionStatus[] = ['COMPLETED', 'APPROVED', 'IN_PROGRESS', 'REJECTED']
  const categories = ['Cleanliness', 'Safety', 'Amenities']

  console.log('✅ Generating 150 inspections...')

  for (let i = 0; i < 150; i++) {
    // Inspector distribution: Top 2 (50%), Next 3 (35%), Bottom 2 (15%)
    let inspectorIndex: number
    const rand = Math.random()
    if (rand < 0.5) {
      inspectorIndex = Math.floor(Math.random() * 2) // Top 2
    } else if (rand < 0.85) {
      inspectorIndex = 2 + Math.floor(Math.random() * 3) // Next 3
    } else {
      inspectorIndex = 5 + Math.floor(Math.random() * 2) // Bottom 2
    }
    const inspector = inspectors[inspectorIndex]

    // Select hotel
    const hotelIndex = Math.floor(Math.random() * hotels.length)
    const hotel = hotels[hotelIndex]
    const hotelType = hotelData[hotelIndex].type
    const hasPendingIssues = hotelData[hotelIndex].pendingIssues

    // Determine status based on hotel type
    let status: InspectionStatus
    if (hasPendingIssues && Math.random() < 0.4) {
      status = Math.random() < 0.5 ? 'REJECTED' : 'IN_PROGRESS'
    } else if (Math.random() < 0.7) {
      status = 'COMPLETED'
    } else if (Math.random() < 0.85) {
      status = 'APPROVED'
    } else {
      status = 'IN_PROGRESS'
    }

    // Realistic timestamp distribution: 60% in recent 3 months
    let inspectionDate: Date
    if (Math.random() < 0.6) {
      inspectionDate = randomDate(threeMonthsAgo, endDate)
    } else {
      // Avoid December/January (fewer inspections)
      let tempDate = randomDate(startDate, threeMonthsAgo)
      while (tempDate.getMonth() === 11 || tempDate.getMonth() === 0) {
        if (Math.random() < 0.3) break // 30% chance to keep Dec/Jan dates
        tempDate = randomDate(startDate, threeMonthsAgo)
      }
      inspectionDate = tempDate
    }

    const completedAt = status === 'COMPLETED' || status === 'APPROVED' ? inspectionDate : null

    // Base rating varies by hotel type and status
    let baseRating: number | null = null
    if (status === 'COMPLETED' || status === 'APPROVED') {
      switch (hotelType) {
        case 'top-performer':
          baseRating = randomRating(4.3, 4.9)
          break
        case 'bottom-performer':
          baseRating = randomRating(2.0, 2.9)
          break
        case 'at-risk':
          baseRating = randomRating(2.5, 3.5)
          break
        case 'declining':
          // Declining trend: older inspections better, recent worse
          const ageInDays = (endDate.getTime() - inspectionDate.getTime()) / (1000 * 60 * 60 * 24)
          if (ageInDays > 180) {
            baseRating = randomRating(3.8, 4.2)
          } else if (ageInDays > 90) {
            baseRating = randomRating(3.3, 3.8)
          } else {
            baseRating = randomRating(2.8, 3.3)
          }
          break
        default: // normal
          baseRating = randomRating(3.5, 4.2)
      }
    }

    // Create inspection
    const inspection = await prisma.inspection.create({
      data: {
        hotelId: hotel.id,
        inspectorId: inspector.id,
        inspectionDate,
        overallRating: baseRating,
        status,
        completedAt,
        notes: `Inspection ${i + 1} - ${status} - ${hotel.name}`,
      },
    })

    // Create category-level inspection results
    if (baseRating !== null) {
      for (const category of categories) {
        // Calculate category rating with realistic variance from overall
        let categoryRating: number
        switch (category) {
          case 'Cleanliness':
            // Cleanliness tends to vary ±0.3 from overall
            categoryRating = Math.max(1.0, Math.min(5.0, baseRating + (Math.random() - 0.5) * 0.6))
            break
          case 'Safety':
            // Safety is more consistent, ±0.2 from overall
            categoryRating = Math.max(1.0, Math.min(5.0, baseRating + (Math.random() - 0.5) * 0.4))
            break
          case 'Amenities':
            // Amenities vary more, ±0.5 from overall
            categoryRating = Math.max(1.0, Math.min(5.0, baseRating + (Math.random() - 0.5) * 1.0))
            break
          default:
            categoryRating = baseRating
        }

        // Round to 1 decimal place
        categoryRating = Math.round(categoryRating * 10) / 10

        // Create InspectionResult with category data
        await prisma.inspectionResult.create({
          data: {
            inspectionId: inspection.id,
            checklistItemId: (await prisma.checklistItem.findFirst({
              where: { category },
            }))!.id,
            result: categoryRating >= 3.5 ? 'PASS' : categoryRating >= 2.5 ? 'NEEDS_IMPROVEMENT' : 'FAIL',
            rating: categoryRating,
            category,
            categoryRating,
            notes: `${category} assessment`,
          },
        })
      }
    }

    // Progress indicator
    if ((i + 1) % 30 === 0) {
      console.log(`  ... ${i + 1}/150 inspections created`)
    }
  }

  console.log('✅ Created 150 inspections with category ratings')

  console.log('🎉 Seed completed successfully!')
  console.log(`
  Created:
  - 7 inspectors (Top 2: John Davis, Sarah Wilson)
  - 10 hotels across major cities
    * 2 top performers (4.5+ avg rating)
    * 2 bottom performers (<3.0 avg rating)
    * 3 at-risk properties (pending issues)
    * 1 declining property (trend downward)
    * 2 normal properties
  - 150 inspections over 12 months
    * 60% in recent 3 months (realistic seasonality)
    * Category-level ratings (Cleanliness, Safety, Amenities)
    * Realistic variance and anomalies
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
