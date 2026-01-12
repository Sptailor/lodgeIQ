'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MobileHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hide logo when scrolled down more than 50px on mobile
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex items-center gap-3 group lg:hidden">
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-2.5 shadow-md group-hover:shadow-lg transition-shadow">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                  LodgeIQ
                </h1>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium hidden sm:block">
                  Inspection Platform
                </p>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
