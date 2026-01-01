/**
 * PhotoUpload Component
 *
 * Premium photo upload with modern design
 * Smooth previews, mobile camera support, touch-friendly interface
 */

'use client'

import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  inspectionId: string
  checklistItemId: string
  existingPhotos: string[]
  onPhotosChange: (photos: string[]) => void
}

export default function PhotoUpload({
  inspectionId,
  checklistItemId,
  existingPhotos,
  onPhotosChange,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please select only image files')
          continue
        }

        // Validate file size (4.5MB max)
        if (file.size > 4.5 * 1024 * 1024) {
          setError('Image too large. Maximum size is 4.5MB')
          continue
        }

        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('inspectionId', inspectionId)
        formData.append('checklistItemId', checklistItemId)

        // Upload to API
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to upload photo')
        }

        const { url } = await response.json()
        uploadedUrls.push(url)
      }

      // Update parent component with new photo URLs
      if (uploadedUrls.length > 0) {
        const newPhotos = [...existingPhotos, ...uploadedUrls]
        onPhotosChange(newPhotos)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = (urlToDelete: string) => {
    const newPhotos = existingPhotos.filter((url) => url !== urlToDelete)
    onPhotosChange(newPhotos)
  }

  return (
    <div>
      {/* Upload button */}
      <div className="flex items-center gap-3 mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id={`photo-upload-${checklistItemId}`}
        />
        <label
          htmlFor={`photo-upload-${checklistItemId}`}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 border-2 border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:border-primary-300 cursor-pointer transition-all",
            isUploading && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Add Photos</span>
            </>
          )}
        </label>

        {existingPhotos.length > 0 && (
          <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
            {existingPhotos.length} photo{existingPhotos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          {error}
        </div>
      )}

      {/* Photo grid */}
      {existingPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {existingPhotos.map((url, index) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border-2 border-neutral-200 hover:border-primary-300 transition-all">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-28 object-cover"
              />
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-1.5 right-1.5 bg-danger-600 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-danger-700"
                title="Delete photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
