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
import { X, Plus, Building2, MapPin, Globe, Phone, Mail, FileText, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
      toast.success('Hotel added successfully!')

      // Refresh the page to show the new hotel
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button onClick={() => setIsOpen(true)} size="lg" className="gap-2 shadow-lg bg-gradient-to-r from-accent-500 to-teal-500 hover:from-accent-600 hover:to-teal-600 border-0">
          <Plus className="w-5 h-5" />
          Add New Property
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
        <div className="flex justify-between items-center mb-6 pb-5 border-b border-neutral-200/50 dark:border-neutral-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">Add New Property</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Fill in the property details below</p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </motion.button>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Hotel Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-accent-600 dark:text-accent-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="Grand Palace Hotel"
              />
            </div>
          </motion.div>

          {/* Address - Required */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="123 Main Street"
              />
            </div>
          </motion.div>

          {/* City and Country */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="Paris"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="France"
              />
            </div>
          </motion.div>

          {/* Phone and Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Phone
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                  placeholder="info@hotel.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Website */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Website
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="https://hotel.com"
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full pl-14 pr-4 py-3 bg-white/80 dark:bg-neutral-800/80 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 dark:focus:border-accent-400 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-all resize-none hover:border-neutral-300 dark:hover:border-neutral-600"
                placeholder="Brief description of the property..."
              />
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-neutral-200/50 dark:border-neutral-700/50"
          >
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-accent-500 to-teal-500 hover:from-accent-600 hover:to-teal-600 border-0 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Property
                </>
              )}
            </Button>
          </motion.div>
        </form>
    </motion.div>
  )
}
