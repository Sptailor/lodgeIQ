'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckIcon } from '@/components/shared/icon'
import { TOUR_STEPS } from '@/components/overview/tour-pill'
import { useMainRef } from './AppShell'
import { useAppState } from './AppState'

type Place = 'up' | 'down' | 'right' | 'left'
type Hint = { keys: string[]; title: string }

// Sidebar label, then the icon only sidebar link, then the phone tab: whichever is on screen.
const nav = (k: string) => [`nav-${k}`, `nav-${k}-link`, `tab-${k}`]

/**
 * What to click next, per tour step, most specific first. The first one found on screen gets the beacon,
 * so the hint follows the visitor: on Follow ups it points at a row, then Assign, then the person list.
 */
const HINTS: Hint[][] = [
  [
    { keys: ['needs-ewaso'], title: 'Open Ewaso River Camp' },
    { keys: nav('overview'), title: 'Go to Overview' },
  ],
  [
    { keys: ['submit'], title: 'Submit the inspection' },
    { keys: ['sample'], title: 'Fill in sample answers' },
    { keys: ['next'], title: 'Go to the next check' },
    { keys: ['answer'], title: 'Answer this check' },
    { keys: ['start'], title: 'Start an inspection' },
    { keys: ['needs-ewaso'], title: 'Open Ewaso River Camp' },
    { keys: nav('overview'), title: 'Go to Overview' },
  ],
  [
    { keys: ['assign-option'], title: 'Pick who fixes it' },
    { keys: ['assign'], title: 'Assign this follow up' },
    { keys: ['fu-row'], title: 'Open a follow up' },
    { keys: ['fu-tab-open'], title: 'Show the ones not assigned' },
    { keys: nav('follow'), title: 'Open Follow ups' },
  ],
  [{ keys: nav('reports'), title: 'Open Reports' }],
]

type Spot = { key: string; title: string; dot: { x: number; y: number }; label: { x: number; y: number; place: Place } }

// On screen and not covered by something else (a dialog, the full screen inspection on a phone).
// A target scrolled out of view still counts, so the page can scroll to it.
const visible = (el: Element) => {
  const r = el.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return false
  const x = r.left + r.width / 2
  const y = r.top + Math.min(r.height / 2, 12)
  if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return true
  const top = document.elementFromPoint(x, y)
  return !!top && (el === top || el.contains(top) || !!top.closest('.tour-label'))
}

function locate(step: number): { el: HTMLElement; hint: Hint } | null {
  for (const hint of HINTS[step] ?? []) {
    for (const key of hint.keys) {
      const el = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`)).find(visible)
      if (el) return { el, hint }
    }
  }
  return null
}

function measure(el: HTMLElement, hint: Hint): Spot {
  const r = el.getBoundingClientRect()
  // Dot: after the text (sidebar labels), on the top left corner (wide rows), or on the top right corner.
  const dotAt = el.dataset.tourDot
  const dot =
    dotAt === 'after'
      ? { x: r.right + 8, y: r.top + r.height / 2 - 3 }
      : dotAt === 'start'
        ? { x: r.left - 3, y: r.top - 3 }
        : dotAt === 'icon'
          ? { x: r.left + r.width / 2 + 7, y: r.top + 9 }
          : { x: r.right - 6, y: r.top - 3 }
  let place = (el.dataset.tourPlace as Place) || 'up'
  // Keep the label on screen.
  if (place === 'up' && r.top < 90) place = 'down'
  if (place === 'up' && r.right < 300) place = 'down'
  const edge = el.closest('nav')?.getBoundingClientRect().right ?? r.right
  if (place === 'right' && Math.max(edge, r.right) + 240 > window.innerWidth) place = 'left'
  const vw = window.innerWidth
  const label =
    place === 'up'
      ? { x: Math.min(r.right, vw - 8), y: r.top - 8, place }
      : place === 'down'
        ? { x: Math.max(8, Math.min(r.left, vw - 228)), y: r.bottom + 8, place }
        : place === 'right'
          ? { x: Math.max(edge, r.right) + 8, y: r.top + r.height / 2, place }
          : { x: r.left - 8, y: r.top + r.height / 2, place }
  return { key: `${hint.title}:${el.dataset.tour}`, title: hint.title, dot, label }
}

const LABEL_SHIFT: Record<Place, string> = {
  up: 'translate(-100%, -100%)',
  down: 'none',
  right: 'translateY(-50%)',
  left: 'translate(-100%, -50%)',
}

/**
 * The demo tour's beacon: a small flickering dot on the next thing to click and a label saying what to do,
 * floating above the page so cards and menus never clip it. Also a short "step done" message
 * each time a step completes. Demo only.
 */
export function TourBeacon() {
  const { isDemo, ready, state, ui, reducedMotion } = useAppState()
  const mainRef = useMainRef()
  const [spot, setSpot] = useState<Spot | null>(null)
  const [done, setDone] = useState<{ id: number; text: string } | null>(null)
  const prevCount = useRef<number | null>(null)
  const scrolledFor = useRef<string | null>(null)

  const step = state.guide.indexOf(false)
  const active = isDemo && ready && !state.guideHidden && step !== -1 && !ui.paletteOpen && !ui.bellOpen && !ui.planFor

  // Follow the target every frame: it moves when the page scrolls, menus open or the layout changes.
  useEffect(() => {
    if (!active) {
      setSpot(null)
      return
    }
    let raf = 0
    let last = ''
    const tick = () => {
      const found = locate(step)
      const next = found ? measure(found.el, found.hint) : null
      const sig = next ? `${next.key}|${Math.round(next.dot.x)}|${Math.round(next.dot.y)}|${Math.round(next.label.x)}|${Math.round(next.label.y)}|${next.label.place}` : ''
      if (sig !== last) {
        last = sig
        setSpot(next)
        // Bring a target that is off screen into view, once per hint.
        if (found && next && scrolledFor.current !== next.key && !found.el.closest('nav')) {
          scrolledFor.current = next.key
          const r = found.el.getBoundingClientRect()
          if (r.top < 64 || r.bottom > window.innerHeight - 80) found.el.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' })
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // Frames pause in background tabs and some embeds; a slow timer keeps the hint in step there too.
    const timer = setInterval(() => {
      cancelAnimationFrame(raf)
      tick()
    }, 300)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(timer)
    }
  }, [active, step, reducedMotion])

  // "Step 2 done. Next: ..." when a step completes in this tab.
  const count = state.guide.filter(Boolean).length
  useEffect(() => {
    if (!isDemo || !ready) return
    const prev = prevCount.current
    prevCount.current = count
    if (prev === null || count <= prev) return
    const next = state.guide.indexOf(false)
    setDone({ id: Date.now(), text: next === -1 ? 'Demo tour complete. Explore on your own.' : `Step ${count} done. Next: ${TOUR_STEPS[next].title.toLowerCase()}` })
    const t = setTimeout(() => setDone(null), 5000)
    return () => clearTimeout(t)
  }, [count, isDemo, ready, state.guide])

  const root = mainRef.current?.closest('.lq')
  if (!root || !isDemo) return null

  return createPortal(
    <>
      {spot && (
        <div aria-hidden="true" className="pointer-events-none">
          <span className="fixed z-[25] h-[7px] w-[7px]" style={{ left: spot.dot.x, top: spot.dot.y }}>
            <span
              className={`absolute inset-0 rounded-full${reducedMotion ? '' : ' beacon-flicker'}`}
              style={{ background: '#6FE3C6', boxShadow: '0 0 0 2px #0B0C0D' }}
            />
          </span>
          <div
            key={spot.key}
            className="tour-label caption-3 fixed z-[25] flex w-max max-w-[220px] items-center gap-2 rounded-[6px] px-2 py-1"
            style={{
              left: spot.label.x,
              top: spot.label.y,
              transform: LABEL_SHIFT[spot.label.place],
              background: 'rgba(20,22,23,.94)',
              border: '1px solid rgba(111,227,198,.32)',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,.35)',
            }}
          >
            <span style={{ color: '#6FE3C6' }}>{step + 1}/4</span>
            <span style={{ fontWeight: 500 }}>{spot.title}</span>
          </div>
        </div>
      )}
      {spot && <span className="sr-only" role="status">{`Demo tour, step ${step + 1} of 4: ${spot.title}`}</span>}
      {done && (
        <div
          key={done.id}
          role="status"
          className="toast caption-3 fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3 py-[6px] max-md:bottom-[152px]"
          style={{ background: 'rgba(20,22,23,.94)', border: '1px solid rgba(111,227,198,.32)', color: '#FFFFFF', fontWeight: 500 }}
        >
          <CheckIcon size={12} color="#6FE3C6" aria-hidden="true" />
          {done.text}
        </div>
      )}
    </>,
    root,
  )
}
