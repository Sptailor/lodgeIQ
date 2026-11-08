/**
 * Access helpers for server components and API routes.
 *
 * - requireUser(): any signed in user, including the demo account.
 * - requireWriter(): a signed in user who may change data. The demo account may not.
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** The current session, or null when signed out. */
export async function getSession() {
  return await auth()
}

/** The signed in user. Throws a 401 when signed out. */
export async function requireUser() {
  const session = await auth()
  if (!session?.user) throw new HttpError(401, 'Sign in to continue')
  return session.user
}

/** A signed in user who may write data. Throws a 403 for the demo account. */
export async function requireWriter() {
  const user = await requireUser()
  if (user.isDemo) throw new HttpError(403, 'The demo account cannot change data')
  return user
}

/** Turn a thrown error into a JSON response. */
export function toErrorResponse(e: unknown) {
  if (e instanceof HttpError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  console.error('API error:', e instanceof Error ? e.message : e)
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}

// Kept only until the old API routes are removed in the next step.
export const getCurrentUser = requireUser
export async function canCreateInspection(): Promise<boolean> {
  const session = await auth()
  return !!session?.user && !session.user.isDemo && ['INSPECTOR', 'ADMIN'].includes(session.user.role)
}
export async function canModifyInspection(inspectorId: string): Promise<boolean> {
  const session = await auth()
  if (!session?.user || session.user.isDemo) return false
  if (session.user.role === 'ADMIN') return true
  return session.user.role === 'INSPECTOR' && session.user.id === inspectorId
}
