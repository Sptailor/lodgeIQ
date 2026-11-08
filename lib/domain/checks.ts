import type { CategoryScores, Res } from './types'

/** The nine standard checks, in checklist order. Used by the seed, the UI and scoring. */
export type CheckDef = {
  slug: string
  category: 0 | 1 | 2
  name: string
  weight: number
  help: string
  evidence: string | null
  alt: string
}

export const CATS = ['Cleanliness', 'Safety', 'Amenities'] as const

export const VAL: Record<Res, number> = { p: 5, n: 3, f: 1 }

export const RES_LABEL: Record<Res, string> = { p: 'Pass', n: 'Needs work', f: 'Fail' }

export const CHECKS: CheckDef[] = [
  { slug: 'bathroom-cleanliness', category: 0, name: 'Bathroom cleanliness', weight: 2.0, help: 'Shower, basin, toilet and floor. Look at grout, drains and behind the door.', evidence: '/images/evidence-bathroom.jpg', alt: 'Bathroom photographed during the inspection' },
  { slug: 'room-cleanliness', category: 0, name: 'Room cleanliness', weight: 1.5, help: 'Check high surfaces, under the bed and window sills in at least three rooms.', evidence: '/images/tent-interior.jpg', alt: 'Guest room photographed during the inspection' },
  { slug: 'linen-quality', category: 0, name: 'Linen quality', weight: 1.5, help: 'Fresh, unstained, no fraying. Count spare pillows and blankets.', evidence: '/images/evidence-linen.jpg', alt: 'Bed linen photographed during the inspection' },
  { slug: 'fire-safety-equipment', category: 1, name: 'Fire safety equipment', weight: 2.0, help: 'Extinguishers in every block you visit: gauge in the green, service tag within 12 months.', evidence: '/images/evidence-extinguisher.jpg', alt: 'Fire extinguisher with its service tag' },
  { slug: 'door-locks', category: 1, name: 'Door locks', weight: 1.5, help: 'Doors lock, close by themselves and log entry. Try the connecting doors too.', evidence: '/images/evidence-door-lock.jpg', alt: 'Room door lock being tested' },
  { slug: 'emergency-information', category: 1, name: 'Emergency information', weight: 1.0, help: 'Evacuation map on the back of each door, in English and the local language.', evidence: '/images/evidence-corridor.jpg', alt: 'Corridor where the evacuation map should hang' },
  { slug: 'wifi-quality', category: 2, name: 'WiFi quality', weight: 1.5, help: 'Run a speed test in a room and the lobby. Guests expect 10 Mbps or more.', evidence: null, alt: 'Speed test' },
  { slug: 'tv-and-entertainment', category: 2, name: 'TV and entertainment', weight: 0.5, help: 'The TV turns on, the remote works, and there is at least one English channel.', evidence: null, alt: 'TV' },
  { slug: 'bathroom-amenities', category: 2, name: 'Bathroom amenities', weight: 1.0, help: 'Soap, shampoo, towels and a hairdryer, all restocked.', evidence: null, alt: 'Amenities' },
]

export const CHECK_COUNT = CHECKS.length

const round1 = (n: number) => Math.round(n * 10) / 10

/**
 * Score a set of answers. `res` is an array or string with one entry per check
 * ('p', 'n', 'f', or empty/undefined when not answered yet).
 * Each category is the weighted mean of its answered checks; the overall score
 * is the mean of the answered category scores. Both are rounded to 1 decimal.
 */
export function scoreOf(res: ArrayLike<string | null | undefined>): {
  c: [number | null, number | null, number | null]
  s: number | null
} {
  const c = [0, 1, 2].map((k) => {
    let sum = 0
    let weight = 0
    CHECKS.forEach((ch, i) => {
      const r = res[i] as Res | null | undefined
      if (ch.category === k && r) {
        sum += ch.weight * VAL[r]
        weight += ch.weight
      }
    })
    return weight ? round1(sum / weight) : null
  }) as [number | null, number | null, number | null]
  const have = c.filter((v): v is number => v != null)
  return { c, s: have.length ? round1(have.reduce((a, b) => a + b, 0) / have.length) : null }
}

/** Score for a full set of nine answers. Throws if anything is missing. */
export function fullScore(res: string): { cats: CategoryScores; score: number } {
  const r = scoreOf(res.split(''))
  if (r.s == null || r.c.some((v) => v == null)) throw new Error('Incomplete answers')
  return { cats: r.c as CategoryScores, score: r.s }
}

export function isValidAnswers(res: unknown): res is string {
  return typeof res === 'string' && res.length === CHECK_COUNT && /^[pnf]+$/.test(res)
}
