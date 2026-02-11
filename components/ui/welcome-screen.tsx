'use client'

import { useState, useEffect } from 'react'

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
    <div className="welcome-screen">
      <h1>LodgeIQ</h1>
    </div>
  )
}
