/**
 * AddHotelForm Component
 *
 * Form to add a new hotel to the database
 * Uses Client Component for form handling and Server Actions for submission
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AddHotelForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create hotel')
      }

      // Reset form and close
      setFormData({
        name: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        description: '',
      })
      setIsOpen(false)

      // Refresh the page to show the new hotel
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="lg" className="gap-2">
        <Plus className="w-5 h-5" />
        Add New Hotel
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-soft"
    >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Add New Hotel</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-3 bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-800 rounded-lg text-danger-700 dark:text-danger-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name - Required */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Hotel Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
              placeholder="Grand Palace Hotel"
            />
          </div>

          {/* Address - Required */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
              placeholder="123 Main Street"
            />
          </div>

          {/* City and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
                placeholder="Paris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
                placeholder="France"
              />
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
                placeholder="info@hotel.com"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all"
              placeholder="https://hotel.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-all resize-none"
              placeholder="Brief description of the property..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Hotel'}
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
    </motion.div>
  )
}
