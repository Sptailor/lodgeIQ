/**
 * StartInspectionButton Component
 *
 * Button to create a new inspection for a hotel
 * Uses client-side API call to create inspection then redirects to inspection form
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface StartInspectionButtonProps {
  hotelId: string
  hotelName: string
}

export default function StartInspectionButton({ hotelId, hotelName }: StartInspectionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="success" size="lg" className="gap-2">
          <ClipboardCheck className="w-5 h-5" />
          Start Inspection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Inspection</DialogTitle>
          <DialogDescription>
            Begin a new inspection for <span className="font-semibold text-neutral-900 dark:text-neutral-50">{hotelName}</span>.
            You'll be guided through the inspection checklist step by step.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-3 p-3 bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={handleStartInspection}
            disabled={isCreating}
            className="gap-2"
          >
            {isCreating ? (
              <>Creating...</>
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4" />
                Begin Inspection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
