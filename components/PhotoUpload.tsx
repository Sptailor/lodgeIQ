/**
 * PhotoUpload Component
 *
 * Allows users to upload photos for inspection checklist items
 * Displays uploaded photos with delete option
 * Mobile-friendly with camera access support
 */

'use client'

import { useState, useRef } from 'react'

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
    <div className="mt-3">
      {/* Upload button */}
      <div className="flex items-center gap-2">
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
          className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {isUploading ? 'Uploading...' : 'Add Photo'}
        </label>

        {existingPhotos.length > 0 && (
          <span className="text-sm text-gray-600">
            {existingPhotos.length} photo{existingPhotos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Photo grid */}
      {existingPhotos.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {existingPhotos.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded border border-gray-200"
              />
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete photo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
