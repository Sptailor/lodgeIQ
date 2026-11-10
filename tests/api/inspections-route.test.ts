import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { CHECKS } from '@/lib/domain/checks'

vi.mock('@/auth', () => ({ auth: vi.fn() }))
vi.mock('@/lib/prisma', () => {
  const op = () => vi.fn((args: unknown) => ({ op: args }))
  return {
    prisma: {
      hotel: { findUnique: vi.fn() },
      checklistItem: { findMany: vi.fn() },
      followUp: { findMany: vi.fn(), create: op(), update: op() },
      inspection: { create: op() },
      activity: { create: op() },
      $transaction: vi.fn(async (ops: unknown[]) => ops),
    },
  }
})

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { POST } from '@/app/api/inspections/route'

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>
const db = prisma as unknown as {
  hotel: { findUnique: ReturnType<typeof vi.fn> }
  checklistItem: { findMany: ReturnType<typeof vi.fn> }
  followUp: { findMany: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> }
  inspection: { create: ReturnType<typeof vi.fn> }
  $transaction: ReturnType<typeof vi.fn>
}

const post = (body: unknown) =>
  POST(new NextRequest('http://localhost/api/inspections', { method: 'POST', body: JSON.stringify(body) }))

const writer = { user: { id: 'u1', name: 'Sarah Wilson', isDemo: false } }

beforeEach(() => {
  vi.clearAllMocks()
  db.hotel.findUnique.mockResolvedValue({ id: 'h1', name: 'Acacia Ridge Camp' })
  db.checklistItem.findMany.mockResolvedValue(CHECKS.map((c, i) => ({ id: `item-${i}`, slug: c.slug })))
  db.followUp.findMany.mockResolvedValue([])
})

describe('POST /api/inspections', () => {
  it('refuses the demo account and never touches the database', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'demo', isDemo: true } })
    const res = await post({ propertyId: 'h1', results: 'ppppppppp' })
    expect(res.status).toBe(403)
    expect(db.hotel.findUnique).not.toHaveBeenCalled()
    expect(db.$transaction).not.toHaveBeenCalled()
  })

  it('refuses a signed out visitor', async () => {
    mockAuth.mockResolvedValue(null)
    expect((await post({ propertyId: 'h1', results: 'ppppppppp' })).status).toBe(401)
  })

  it.each([
    [{ results: 'ppppppppp' }],
    [{ propertyId: 'h1', results: 'pppp' }],
    [{ propertyId: 'h1', results: 'ppppppppx' }],
  ])('rejects a malformed body %o with 400', async (body) => {
    mockAuth.mockResolvedValue(writer)
    expect((await post(body)).status).toBe(400)
  })

  it('returns 404 for an unknown property', async () => {
    mockAuth.mockResolvedValue(writer)
    db.hotel.findUnique.mockResolvedValue(null)
    expect((await post({ propertyId: 'nope', results: 'ppppppppp' })).status).toBe(404)
  })

  it('saves the inspection, opens follow ups for failures, and writes everything in one transaction', async () => {
    mockAuth.mockResolvedValue(writer)
    const res = await post({
      propertyId: 'h1',
      results: 'pppfppppp',
      photos: [[], [], [], ['https://blob.example.com/fire.jpg', 'javascript:alert(1)']],
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.inspection).toMatchObject({ score: 4.4, cats: [5, 3.2, 5], res: 'pppfppppp', inspector: 'Sarah Wilson' })
    expect(body).toMatchObject({ opened: 1, closed: 0, improved: 0 })
    expect(body.followUps[0]).toMatchObject({ checkIndex: 3, photo: 'https://blob.example.com/fire.jpg' })

    expect(db.$transaction).toHaveBeenCalledTimes(1)
    expect(db.$transaction.mock.calls[0][0]).toHaveLength(3) // inspection, follow up, activity
    const saved = db.inspection.create.mock.calls[0][0].data
    expect(saved).toMatchObject({ hotelId: 'h1', inspectorId: 'u1', overallRating: 4.4, followUpRequired: true })
    // Unsafe photo URLs are dropped before they reach the database.
    expect(saved.inspectionResults.create[3].photoUrls).toEqual(['https://blob.example.com/fire.jpg'])
  })
})
