'use client'

import { useEffect, useRef, useState } from 'react'

const TAGLINE = [['Every', 'property', 'you', 'sell'], ['gets', 'one', 'score.'], ['Your', 'whole', 'team'], ['reads', 'it', 'the', 'same', 'way.']]

/** The statement lights up word by word as you scroll past it. */
export function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [lit, setLit] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    let queued = false
    const update = () => {
      queued = false
      const el = ref.current
      if (!el) return
      const line = window.innerHeight * 0.62
      let n = 0
      el.querySelectorAll('.word').forEach((s) => {
        if (s.getBoundingClientRect().top < line) n++
      })
      setLit(n)
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  let i = 0
  return (
    <section className="sec" aria-label="What LodgeIQ is for" style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box' }}>
      <p ref={ref} className="heading-1" style={{ maxWidth: 680 }}>
        {TAGLINE.map((line, li) =>
          line.map((w, j) => {
            const on = reduce || i++ < lit
            return (
              <span key={`${li}-${j}`}>
                <span className="word" style={{ opacity: on ? 1 : 0.3 }}>
                  {w + (j < line.length - 1 ? ' ' : '')}
                </span>
                {j === line.length - 1 && li < TAGLINE.length - 1 && <br />}
              </span>
            )
          }),
        )}
      </p>
    </section>
  )
}
