/**
 * Conversions between database rows and the shared domain types.
 * Used by the snapshot loader and by the API routes.
 */

import type { FollowUp as DbFollowUp, FollowUpStatus as DbStatus, Visit as DbVisit } from '@prisma/client'
import { CHECKS } from '../domain/checks'
import type { FollowUp, FollowUpStatus, Visit } from '../domain/types'

export const followUpStatusFromDb = (s: DbStatus): FollowUpStatus =>
  s === 'OPEN' ? 'open' : s === 'IN_PROGRESS' ? 'progress' : 'done'

export const followUpStatusToDb = (s: FollowUpStatus): DbStatus =>
  s === 'open' ? 'OPEN' : s === 'progress' ? 'IN_PROGRESS' : 'DONE'

/** Position of a checklist item in the standard nine checks, or -1 if it is not one of them. */
export const checkIndexOfSlug = (slug: string | null | undefined): number =>
  CHECKS.findIndex((c) => c.slug === slug)

export function followUpFromDb(row: DbFollowUp & { checklistItem: { slug: string | null } }): FollowUp {
  return {
    id: row.id,
    propertyId: row.hotelId,
    checkIndex: checkIndexOfSlug(row.checklistItem.slug),
    text: row.text,
    photo: row.photoUrl,
    status: followUpStatusFromDb(row.status),
    owner: row.ownerName,
    due: row.dueDate.toISOString(),
    note: row.note,
  }
}

export function visitFromDb(row: DbVisit): Visit {
  return {
    id: row.id,
    propertyId: row.hotelId,
    inspectorId: row.inspectorId,
    date: row.date.toISOString(),
  }
}

const RESULT_CHAR = { PASS: 'p', NEEDS_IMPROVEMENT: 'n', FAIL: 'f' } as const

/**
 * Turn stored results into the nine character answer string, in checklist order.
 * Returns null when the inspection does not have all nine standard checks.
 */
export function resultsToString(results: { result: string; checklistItem: { slug: string | null } }[]): string | null {
  const chars: (string | undefined)[] = new Array(CHECKS.length).fill(undefined)
  for (const r of results) {
    const i = checkIndexOfSlug(r.checklistItem.slug)
    const c = RESULT_CHAR[r.result as keyof typeof RESULT_CHAR]
    if (i >= 0 && c) chars[i] = c
  }
  return chars.every(Boolean) ? chars.join('') : null
}
