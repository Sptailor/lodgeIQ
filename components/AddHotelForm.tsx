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
      className="bg-gradient-to-br from-white to-accent-50/20 dark:from-neutral-850/50 dark:to-neutral-900/50 border border-accent-200/50 dark:border-accent-900/30 rounded-lg p-7 shadow-soft-lg ring-1 ring-accent-100/40 dark:ring-accent-950/20"
    >
        <div className="flex justify-between items-center mb-7">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Add New Property</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-accent-700 dark:hover:text-accent-300 transition-all shadow-sm"
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name - Required */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
              Hotel Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
              placeholder="Grand Palace Hotel"
            />
          </div>

          {/* Address - Required */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
              placeholder="123 Main Street"
            />
          </div>

          {/* City and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
                placeholder="Paris"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
                placeholder="France"
              />
            </div>
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
                placeholder="info@hotel.com"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm"
              placeholder="https://hotel.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-neutral-700 dark:text-neutral-200 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-900/50 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-600 focus:border-accent-400 dark:focus:border-accent-600 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all font-medium shadow-sm resize-none"
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
