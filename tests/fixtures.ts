import { fullScore } from '@/lib/domain/checks'
import type { FollowUp, InspectionSummary, Property } from '@/lib/domain/types'

/** Monday 9 November 2026, midday UTC. */
export const NOW = new Date('2026-11-09T12:00:00Z')

export function inspection(date: string, res = 'ppppppppp', id = `i-${date}`): InspectionSummary {
  const { cats, score } = fullScore(res)
  return { id, date: new Date(date).toISOString(), inspector: 'Test Inspector', score, cats, res }
}

export function property(overrides: Partial<Property> = {}): Property {
  return {
    id: 'p1',
    name: 'Test Lodge',
    place: 'Somewhere',
    city: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KEN',
    region: 'Kenya',
    lat: 0,
    lon: 0,
    photo: null,
    kind: 'Lodge',
    size: '20 rooms',
    visitStandardDays: 90,
    inspections: [inspection('2026-11-01T09:00:00Z')],
    ...overrides,
  }
}

export function followUp(overrides: Partial<FollowUp> = {}): FollowUp {
  return {
    id: 'fu1',
    propertyId: 'p1',
    checkIndex: 3,
    text: 'Fire safety equipment failed.',
    photo: null,
    status: 'open',
    owner: null,
    due: '2026-11-16T00:00:00.000Z',
    note: null,
    ...overrides,
  }
}
