/**
 * Photo Upload API Route
 *
 * POST /api/upload-photo - Upload a photo to Vercel Blob storage
 *
 * Handles photo uploads for inspection results. Photos are stored in Vercel Blob
 * and URLs are returned to be saved with the inspection result.
 */

import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getCurrentUser } from '@/lib/auth-utils'

/**
 * POST /api/upload-photo
 * Uploads a single photo to Vercel Blob storage
 *
 * Expected: multipart/form-data with:
 * - file: Image file (JPEG, PNG, WebP)
 * - inspectionId: string (for organizing photos)
 * - checklistItemId: string (for organizing photos)
 *
 * Returns: { url: string } - Public URL of uploaded photo
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await getCurrentUser()

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const inspectionId = formData.get('inspectionId') as string
    const checklistItemId = formData.get('checklistItemId') as string

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!inspectionId || !checklistItemId) {
      return NextResponse.json(
        { error: 'Missing inspectionId or checklistItemId' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' },
        { status: 400 }
      )
    }

    // Validate file size (max 4.5MB for Vercel Blob free tier)
    const maxSize = 4.5 * 1024 * 1024 // 4.5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4.5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const filename = `inspections/${inspectionId}/${checklistItemId}/${timestamp}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Adds random suffix to prevent filename conflicts
    })

    // Return the public URL
    return NextResponse.json(
      { url: blob.url },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading photo:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Handle Vercel Blob errors
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN in .env' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}
