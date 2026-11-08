/**
 * Nightly demo reset.
 * GET /api/cron/reseed-demo
 *
 * Called by Vercel Cron (see vercel.json) with the header
 * `Authorization: Bearer <CRON_SECRET>`. Rebuilds the sample portfolio so the
 * dates in the demo always sit close to today.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetSampleData } from '@/lib/seed/sample-seed'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await resetSampleData(prisma)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Demo reseed failed:', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Reseed failed' }, { status: 500 })
  }
}
