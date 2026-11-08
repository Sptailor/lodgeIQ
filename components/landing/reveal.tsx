'use client'

import { useEffect, useRef, useState } from 'react'

/** Fades a section up the first time it scrolls into view. Shows at once when reduced motion is on. */
export function Reveal({ id, className = '', children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id={id} ref={ref} className={`reveal ${className}`.trim()} style={shown ? { opacity: 1, transform: 'none' } : { opacity: 0, transform: 'translateY(32px)' }}>
      {children}
    </section>
  )
}
