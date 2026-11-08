import { HttpError } from '../auth-utils'
import { startOfUtcDay } from '../domain/format'

/** Visits are stored at 09:00 UTC on the chosen day. */
export function visitDate(input: unknown): Date {
  const d = typeof input === 'string' ? new Date(input) : null
  if (!d || Number.isNaN(d.getTime())) throw new HttpError(400, 'Choose a valid day')
  return new Date(startOfUtcDay(d).getTime() + 9 * 3600000)
}
