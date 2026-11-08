/**
 * One click demo sign in.
 * GET /demo            -> signs in as the demo account, then opens /app
 * GET /demo?next=/app/... -> same, then opens that page (only paths under /app)
 */

import { NextResponse } from 'next/server'
import { signIn } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get('next') ?? '/app'
  const redirectTo = next.startsWith('/app') ? next : '/app'
  // signIn throws a redirect when it succeeds. Do not catch it.
  await signIn('demo', { redirectTo })
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
