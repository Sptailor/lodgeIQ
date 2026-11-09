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

type Spot = { key: string; title: string; dot: { x: number; y: number }; label: { x: number; y: number; place: Place; arrow: number } }

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

const DOT = 10 // px

/**
 * Lines up the label, its arrow and the dot on one axis through the target.
 * Above or below: the label is centred on the button (or near the left of a wide row), the arrow points
 * at that spot and the dot sits on the button's edge right under the arrow.
 * Beside: everything lines up with the middle of the target. Sidebar labels keep the dot just after the text.
 */
function measure(el: HTMLElement, hint: Hint, half: number): Spot {
  const r = el.getBoundingClientRect()
  const vw = window.innerWidth
  const midY = r.top + r.height / 2
  let place = (el.dataset.tourPlace as Place) || 'up'
  if (place === 'up' && r.top < 70) place = 'down'
  const after = el.dataset.tourDot === 'after'
  const edge = after ? (el.closest('nav')?.getBoundingClientRect().right ?? r.right) : r.right
  if (place === 'right' && edge + 12 + half * 2 > vw) place = 'left'

  const key = `${hint.title}:${el.dataset.tour}`
  if (place === 'up' || place === 'down') {
    const ax = r.width > 400 ? r.left + 32 : r.left + r.width / 2
    // Keep the label on screen; the arrow stays on the target and never leaves the label.
    const cx = Math.max(8 + half, Math.min(ax, vw - 8 - half))
    const edgeY = place === 'up' ? r.top : r.bottom
    return {
      key,
      title: hint.title,
      dot: { x: ax - DOT / 2, y: edgeY - DOT / 2 },
      label: { x: cx, y: place === 'up' ? r.top - 12 : r.bottom + 12, place, arrow: Math.round(Math.max(-half + 12, Math.min(ax - cx, half - 12))) },
    }
  }
  if (place === 'right') {
    return {
      key,
      title: hint.title,
      dot: after ? { x: r.right + 8, y: midY - DOT / 2 } : { x: r.right - DOT / 2, y: midY - DOT / 2 },
      label: { x: (after ? edge : r.right) + 12, y: midY, place, arrow: 0 },
    }
  }
  return { key, title: hint.title, dot: { x: r.left - DOT / 2, y: midY - DOT / 2 }, label: { x: r.left - 12, y: midY, place, arrow: 0 } }
}

const LABEL_SHIFT: Record<Place, string> = {
  up: 'translate(-50%, -100%)',
  down: 'translateX(-50%)',
  right: 'translateY(-50%)',
  left: 'translate(-100%, -50%)',
}
const arrowStyle = (place: Place, offset: number): React.CSSProperties =>
  place === 'up'
    ? { left: `calc(50% + ${offset}px - 4px)`, bottom: -4 }
    : place === 'down'
      ? { left: `calc(50% + ${offset}px - 4px)`, top: -4 }
      : place === 'right'
        ? { left: -4, top: 'calc(50% - 4px)' }
        : { right: -4, top: 'calc(50% - 4px)' }

/**
 * The demo tour's beacon: a pulsing dot on the next thing to click and a label saying what to do,
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
  const labelRef = useRef<HTMLDivElement>(null)

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
      const half = (labelRef.current?.offsetWidth || 160) / 2
      const next = found ? measure(found.el, found.hint, half) : null
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
          <span className="fixed z-[25] h-[10px] w-[10px]" style={{ left: spot.dot.x, top: spot.dot.y }}>
            {!reducedMotion && (
              <>
                <span className="beacon-wave absolute inset-0 rounded-full" />
                <span className="beacon-wave beacon-wave-2 absolute inset-0 rounded-full" />
              </>
            )}
            <span className="absolute inset-[2px] rounded-full" style={{ background: '#6FE3C6', boxShadow: '0 0 0 2px #0B0C0D' }} />
          </span>
          <div
            key={spot.key}
            ref={labelRef}
            className="tour-label fixed z-[25] box-border w-max max-w-[200px] rounded-[8px] px-2 py-[5px]"
            style={{ left: spot.label.x, top: spot.label.y, transform: LABEL_SHIFT[spot.label.place], background: '#6FE3C6', color: '#05221C' }}
          >
            <span className="absolute h-2 w-2 rotate-45" style={{ background: '#6FE3C6', ...arrowStyle(spot.label.place, spot.label.arrow) }} />
            <span className="relative block text-[10px] font-semibold leading-[14px]">Step {step + 1} of 4</span>
            <span className="caption-3 relative block">{spot.title}</span>
          </div>
        </div>
      )}
      {spot && <span className="sr-only" role="status">{`Demo tour, step ${step + 1} of 4: ${spot.title}`}</span>}
      {done && (
        <div
          key={done.id}
          role="status"
          className="toast caption-3 fixed bottom-24 left-1/2 z-40 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-[6px] max-md:bottom-[152px]"
          style={{ background: '#6FE3C6', color: '#05221C' }}
        >
          <CheckIcon size={12} aria-hidden="true" />
          {done.text}
        </div>
      )}
    </>,
    root,
  )
}
