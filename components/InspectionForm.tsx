/**
 * InspectionForm Component
 *
 * Interactive checklist form for conducting hotel inspections
 * Groups items by category, allows PASS/FAIL/NEEDS_IMPROVEMENT selection
 * Auto-saves results as user progresses through checklist
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types
type ResultStatus = 'PENDING' | 'PASS' | 'FAIL' | 'NEEDS_IMPROVEMENT' | 'NOT_APPLICABLE'

type ChecklistItem = {
  id: string
  category: string
  itemName: string
  description: string | null
  weight: number
  order: number
}

type InspectionResult = {
  id: string
  checklistItemId: string
  result: ResultStatus
  rating: number | null
  notes: string | null
  checklistItem: ChecklistItem
}

type Inspection = {
  id: string
  status: string
  notes: string | null
  hotel: {
    id: string
    name: string
  }
  inspectionResults: InspectionResult[]
}

interface InspectionFormProps {
  inspection: Inspection
  checklistItems: ChecklistItem[]
}

export default function InspectionForm({ inspection, checklistItems }: InspectionFormProps) {
  const router = useRouter()

  // Track results state (checklistItemId -> { result, notes, rating })
  const [results, setResults] = useState<Record<string, { result: ResultStatus; notes: string; rating: number | null }>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [generalNotes, setGeneralNotes] = useState(inspection.notes || '')

  // Initialize results from existing inspection results
  useEffect(() => {
    const initialResults: Record<string, { result: ResultStatus; notes: string; rating: number | null }> = {}
    inspection.inspectionResults.forEach((ir) => {
      initialResults[ir.checklistItemId] = {
        result: ir.result as ResultStatus,
        notes: ir.notes || '',
        rating: ir.rating,
      }
    })
    setResults(initialResults)
  }, [inspection.inspectionResults])

  // Group checklist items by category
  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const categories = Object.keys(groupedItems)

  // Get current result for an item
  const getResult = (itemId: string): ResultStatus => {
    return results[itemId]?.result || 'PENDING'
  }

  const getNotes = (itemId: string): string => {
    return results[itemId]?.notes || ''
  }

  // Handle result change and auto-save
  const handleResultChange = async (itemId: string, newResult: ResultStatus) => {
    // Update local state
    setResults((prev) => ({
      ...prev,
      [itemId]: {
        result: newResult,
        notes: prev[itemId]?.notes || '',
        rating: prev[itemId]?.rating || null,
      },
    }))

    // Auto-save to API
    try {
      await fetch('/api/inspection-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionId: inspection.id,
          checklistItemId: itemId,
          result: newResult,
          notes: results[itemId]?.notes || '',
        }),
      })
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  // Handle notes change (debounced save would be better in production)
  const handleNotesChange = async (itemId: string, notes: string) => {
    // Update local state
    setResults((prev) => ({
      ...prev,
      [itemId]: {
        result: prev[itemId]?.result || 'PENDING',
        notes,
        rating: prev[itemId]?.rating || null,
      },
    }))
  }

  // Save notes when input loses focus
  const handleNotesBlur = async (itemId: string) => {
    const currentResult = results[itemId]
    if (!currentResult) return

    try {
      await fetch('/api/inspection-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionId: inspection.id,
          checklistItemId: itemId,
          result: currentResult.result,
          notes: currentResult.notes,
        }),
      })
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  // Complete inspection
  const handleComplete = async () => {
    setIsCompleting(true)

    try {
      // Calculate completion percentage
      const totalItems = checklistItems.length
      const completedItems = Object.values(results).filter((r) => r.result !== 'PENDING').length

      if (completedItems < totalItems) {
        const confirm = window.confirm(
          `You have only completed ${completedItems} out of ${totalItems} items. Are you sure you want to complete this inspection?`
        )
        if (!confirm) {
          setIsCompleting(false)
          return
        }
      }

      // Calculate simple overall rating (average of PASS/FAIL/NEEDS_IMPROVEMENT)
      // PASS = 5, NEEDS_IMPROVEMENT = 3, FAIL = 1, others don't count
      const ratedResults = Object.values(results).filter((r) =>
        ['PASS', 'FAIL', 'NEEDS_IMPROVEMENT'].includes(r.result)
      )
      let overallRating = null
      if (ratedResults.length > 0) {
        const sum = ratedResults.reduce((acc, r) => {
          if (r.result === 'PASS') return acc + 5
          if (r.result === 'NEEDS_IMPROVEMENT') return acc + 3
          if (r.result === 'FAIL') return acc + 1
          return acc
        }, 0)
        overallRating = sum / ratedResults.length
      }

      // Check if any items failed or need improvement
      const needsFollowUp = Object.values(results).some((r) =>
        r.result === 'FAIL' || r.result === 'NEEDS_IMPROVEMENT'
      )

      // Update inspection status to COMPLETED
      await fetch(`/api/inspections/${inspection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          notes: generalNotes,
          overallRating,
          followUpRequired: needsFollowUp,
        }),
      })

      // Redirect to hotel page
      router.push(`/hotels/${inspection.hotel.id}`)
    } catch (error) {
      console.error('Error completing inspection:', error)
      alert('Failed to complete inspection. Please try again.')
      setIsCompleting(false)
    }
  }

  // Calculate progress
  const totalItems = checklistItems.length
  const completedItems = Object.values(results).filter((r) => r.result !== 'PENDING').length
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div>
      {/* Progress bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {completedItems} / {totalItems} items
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {category}
            </h3>

            <div className="space-y-4">
              {groupedItems[category].map((item) => {
                const currentResult = getResult(item.id)
                const currentNotes = getNotes(item.id)

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {/* Item name and description */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.itemName}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>

                    {/* Result buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => handleResultChange(item.id, 'PASS')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          currentResult === 'PASS'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                        }`}
                      >
                        ✓ Pass
                      </button>
                      <button
                        onClick={() => handleResultChange(item.id, 'NEEDS_IMPROVEMENT')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          currentResult === 'NEEDS_IMPROVEMENT'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                        }`}
                      >
                        ⚠ Needs Attention
                      </button>
                      <button
                        onClick={() => handleResultChange(item.id, 'FAIL')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          currentResult === 'FAIL'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                        }`}
                      >
                        ✗ Fail
                      </button>
                      <button
                        onClick={() => handleResultChange(item.id, 'NOT_APPLICABLE')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          currentResult === 'NOT_APPLICABLE'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        N/A
                      </button>
                    </div>

                    {/* Notes textarea */}
                    <textarea
                      value={currentNotes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      onBlur={() => handleNotesBlur(item.id)}
                      placeholder="Add notes (optional)..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* General notes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          General Inspection Notes
        </h3>
        <textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder="Add overall notes about this inspection..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Complete button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCompleting ? 'Completing...' : 'Complete Inspection'}
        </button>
      </div>
    </div>
  )
}
