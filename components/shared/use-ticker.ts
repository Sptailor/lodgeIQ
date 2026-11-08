'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Progress from 0 to 1 over `durationMs` with an ease out, starting when the component mounts.
 * Returns 1 on the server and when the visitor prefers reduced motion, so real numbers always show.
 */
export function useTicker(durationMs = 1400): number {
  const [p, setP] = useState(1)
  useIsoLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const t0 = performance.now()
    setP(0)
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / durationMs)
      setP(1 - Math.pow(1 - k, 4))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [durationMs])
  return p
}
