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

  const text = 'LodgeIQ'
  const letters = text.split('')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="welcome-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="welcome-text">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                }}
                className="welcome-letter"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
