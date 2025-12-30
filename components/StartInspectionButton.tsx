/**
 * StartInspectionButton Component
 *
 * Button to create a new inspection for a hotel
 * Uses client-side API call to create inspection then redirects to inspection form
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface StartInspectionButtonProps {
  hotelId: string
}

export default function StartInspectionButton({ hotelId }: StartInspectionButtonProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartInspection = async () => {
    setIsCreating(true)
    setError(null)

    try {
      // Create new inspection (API will use authenticated user as inspector)
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create inspection')
      }

      const inspection = await response.json()

      // Redirect to inspection form
      router.push(`/inspections/${inspection.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsCreating(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleStartInspection}
        disabled={isCreating}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Starting...' : '+ Start Inspection'}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
