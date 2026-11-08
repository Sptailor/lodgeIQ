'use client'

import { useAppState } from './AppState'

const COLORS = ['#6FE3C6', '#FFC56B', '#FFFFFF', '#FF8A7A']

const BITS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.3
  const d = 140 + ((i * 37) % 160)
  return {
    background: COLORS[i % 4],
    '--tx': `${Math.round(Math.cos(a) * d)}px`,
    '--ty': `${Math.round(Math.sin(a) * d * 0.8 + 60)}px`,
    '--r': `${((i * 97) % 540) - 270}deg`,
    animationDelay: `${(i % 5) * 30}ms`,
  } as React.CSSProperties
})

/** A short burst when an inspection raises the score. Hidden for reduced motion. */
export function Confetti() {
  const { confetti } = useAppState()
  if (!confetti) return null
  return (
    <div key={confetti} aria-hidden="true" className="pointer-events-none fixed z-[45]" style={{ left: '60%', top: '36%' }}>
      {BITS.map((style, i) => (
        <span key={i} className="bit" style={style} />
      ))}
    </div>
  )
}
