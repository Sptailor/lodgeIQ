'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome')
    if (hasSeenWelcome) {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="welcome-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h1>LodgeIQ</h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
