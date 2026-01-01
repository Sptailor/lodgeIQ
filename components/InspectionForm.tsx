/**
 * InspectionForm Component
 *
 * Premium inspection interface with card-based design
 * Large touch-friendly controls, smooth interactions, professional UX
 * Auto-saves results as user progresses through checklist
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, AlertTriangle, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import PhotoUpload from '@/components/PhotoUpload'
import { cn } from '@/lib/utils'

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
  photoUrls: string[]
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

  // Track results state (checklistItemId -> { result, notes, rating, photoUrls })
  const [results, setResults] = useState<Record<string, { result: ResultStatus; notes: string; rating: number | null; photoUrls: string[] }>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [generalNotes, setGeneralNotes] = useState(inspection.notes || '')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Initialize results from existing inspection results
  useEffect(() => {
    const initialResults: Record<string, { result: ResultStatus; notes: string; rating: number | null; photoUrls: string[] }> = {}
    inspection.inspectionResults.forEach((ir) => {
      initialResults[ir.checklistItemId] = {
        result: ir.result as ResultStatus,
        notes: ir.notes || '',
        rating: ir.rating,
        photoUrls: ir.photoUrls || [],
      }
    })
    setResults(initialResults)

    // Expand first category by default
    const categories = Object.keys(groupedItems)
    if (categories.length > 0) {
      setExpandedCategories({ [categories[0]]: true })
    }
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

  const getPhotos = (itemId: string): string[] => {
    return results[itemId]?.photoUrls || []
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
        photoUrls: prev[itemId]?.photoUrls || [],
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
          photoUrls: results[itemId]?.photoUrls || [],
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
        photoUrls: prev[itemId]?.photoUrls || [],
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
          photoUrls: currentResult.photoUrls || [],
        }),
      })
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  // Handle photo changes and auto-save
  const handlePhotosChange = async (itemId: string, newPhotos: string[]) => {
    // Update local state
    setResults((prev) => ({
      ...prev,
      [itemId]: {
        result: prev[itemId]?.result || 'PENDING',
        notes: prev[itemId]?.notes || '',
        rating: prev[itemId]?.rating || null,
        photoUrls: newPhotos,
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
          result: results[itemId]?.result || 'PENDING',
          notes: results[itemId]?.notes || '',
          photoUrls: newPhotos,
        }),
      })
    } catch (error) {
      console.error('Error saving photos:', error)
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
          `You have completed ${completedItems} of ${totalItems} items. Complete inspection anyway?`
        )
        if (!confirm) {
          setIsCompleting(false)
          return
        }
      }

      // Calculate overall rating
      let overallRating = null
      const ratedResults = Object.values(results).filter((r) => r.rating !== null && r.rating > 0)
      if (ratedResults.length > 0) {
        const sum = ratedResults.reduce((acc, r) => acc + (r.rating || 0), 0)
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

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Calculate progress
  const totalItems = checklistItems.length
  const completedItems = Object.values(results).filter((r) => r.result !== 'PENDING').length
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-soft sticky top-4 z-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-neutral-900">Inspection Progress</h3>
          <span className="text-sm font-medium text-primary-600">
            {completedItems} / {totalItems} items
          </span>
        </div>
        <div className="relative w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500 mt-2">{progressPercent}% complete</p>
      </div>

      {/* Checklist by category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = groupedItems[category]
          const categoryCompleted = categoryItems.filter((item) =>
            getResult(item.id) !== 'PENDING'
          ).length
          const isExpanded = expandedCategories[category]

          return (
            <div key={category} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-soft">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-neutral-900">{category}</h3>
                  <span className="text-xs font-medium px-2.5 py-1 bg-white rounded-full text-neutral-600 border border-neutral-200">
                    {categoryCompleted} / {categoryItems.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                )}
              </button>

              {/* Category items */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {categoryItems.map((item) => {
                    const currentResult = getResult(item.id)
                    const currentNotes = getNotes(item.id)

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "border-2 rounded-xl p-5 transition-all",
                          currentResult === 'PENDING' && "border-neutral-200 bg-white",
                          currentResult === 'PASS' && "border-success-300 bg-success-50",
                          currentResult === 'FAIL' && "border-danger-300 bg-danger-50",
                          currentResult === 'NEEDS_IMPROVEMENT' && "border-warning-300 bg-warning-50",
                          currentResult === 'NOT_APPLICABLE' && "border-neutral-300 bg-neutral-50"
                        )}
                      >
                        {/* Item header */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-neutral-900 mb-1.5 text-base">
                            {item.itemName}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-neutral-600 leading-relaxed">{item.description}</p>
                          )}
                        </div>

                        {/* Result buttons - Large and touch-friendly */}
                        <div className="grid grid-cols-2 gap-2.5 mb-4">
                          <button
                            onClick={() => handleResultChange(item.id, 'PASS')}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all",
                              currentResult === 'PASS'
                                ? 'bg-success-600 text-white shadow-soft-lg scale-105'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-success-400 hover:bg-success-50'
                            )}
                          >
                            <Check className="w-5 h-5" />
                            Pass
                          </button>

                          <button
                            onClick={() => handleResultChange(item.id, 'FAIL')}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all",
                              currentResult === 'FAIL'
                                ? 'bg-danger-600 text-white shadow-soft-lg scale-105'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-danger-400 hover:bg-danger-50'
                            )}
                          >
                            <X className="w-5 h-5" />
                            Fail
                          </button>

                          <button
                            onClick={() => handleResultChange(item.id, 'NEEDS_IMPROVEMENT')}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all",
                              currentResult === 'NEEDS_IMPROVEMENT'
                                ? 'bg-warning-600 text-white shadow-soft-lg scale-105'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-warning-400 hover:bg-warning-50'
                            )}
                          >
                            <AlertTriangle className="w-5 h-5" />
                            Needs Attention
                          </button>

                          <button
                            onClick={() => handleResultChange(item.id, 'NOT_APPLICABLE')}
                            className={cn(
                              "flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all",
                              currentResult === 'NOT_APPLICABLE'
                                ? 'bg-neutral-600 text-white shadow-soft-lg scale-105'
                                : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100'
                            )}
                          >
                            <Minus className="w-5 h-5" />
                            N/A
                          </button>
                        </div>

                        {/* Notes textarea */}
                        <textarea
                          value={currentNotes}
                          onChange={(e) => handleNotesChange(item.id, e.target.value)}
                          onBlur={() => handleNotesBlur(item.id)}
                          placeholder="Add notes (optional)..."
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                        />

                        {/* Photo upload */}
                        <div className="mt-3">
                          <PhotoUpload
                            inspectionId={inspection.id}
                            checklistItemId={item.id}
                            existingPhotos={getPhotos(item.id)}
                            onPhotosChange={(newPhotos) => handlePhotosChange(item.id, newPhotos)}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Complete inspection button */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-soft">
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className="w-full bg-gradient-to-r from-success-600 to-success-700 text-white px-8 py-4 rounded-xl font-semibold text-base hover:from-success-700 hover:to-success-800 transition-all shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting ? 'Completing Inspection...' : 'Complete Inspection'}
        </button>
      </div>
    </div>
  )
}
