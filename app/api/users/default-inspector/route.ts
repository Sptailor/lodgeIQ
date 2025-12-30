/**
 * Default Inspector API Route
 *
 * GET /api/users/default-inspector - Get hardcoded inspector for development
 *
 * This is a temporary endpoint until authentication is implemented
 * In production, user info will come from auth session
 */

import { NextResponse } from 'next/server'
import { getDefaultInspector } from '@/lib/default-inspector'

export async function GET() {
  try {
    const inspector = await getDefaultInspector()
    return NextResponse.json(inspector, { status: 200 })
  } catch (error) {
    console.error('Error fetching default inspector:', error)
    return NextResponse.json(
      { error: 'Default inspector not found. Please run: npx prisma db seed' },
      { status: 404 }
    )
  }
}
