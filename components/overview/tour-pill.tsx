'use client'

import { useRouter } from 'next/navigation'
import { useAppState } from '@/components/app/AppState'
import { CheckIcon, CloseIcon } from '@/components/shared/icon'

const EWASO = 'ewaso-river-camp'

const STEPS = [
  { title: 'Open the property that needs you', sub: 'Ewaso River Camp failed two safety checks', href: `/app/properties/${EWASO}` },
  { title: 'Run an inspection', sub: 'Use the phone view, or fill in sample answers', href: `/app/properties/${EWASO}/inspect` },
  { title: 'Assign a follow up', sub: 'Send a failed check to whoever fixes it', href: '/app/follow-ups' },
  { title: 'Check the report', sub: 'See your inspection move the numbers', href: '/app/reports' },
]

const RING = [-86, 4, 94, 184]

/** The demo tour: a small pill with a four step ring. Demo only. */
export function TourPill() {
  const { isDemo, state, hideGuide, toggleGuideSteps } = useAppState()
  const router = useRouter()
  if (!isDemo || state.guideHidden) return null

  const done = state.guide.filter(Boolean).length
  const next = state.guide.indexOf(false)
  const open = state.guideOpen

  return (
    <div className="glass flex items-center gap-3 rounded-full py-1 pl-4 pr-1" role="region" aria-label="Demo tour">
      <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="14" />
        {RING.map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#6FE3C6"
            strokeWidth="14"
            strokeDasharray="55 196"
            transform={`rotate(${r} 50 50)`}
            style={{ opacity: state.guide[i] ? 1 : 0, transition: 'opacity 500ms cubic-bezier(.22,1,.36,1)' }}
          />
        ))}
      </svg>
      <span className="body-5">{done === 4 ? 'Demo tour complete' : `Demo tour ${next + 1} of 4: ${STEPS[next].title}`}</span>
      {done < 4 && (
        <button type="button" className="btn btn-primary button-sm" onClick={() => router.push(STEPS[next].href)}>
          Go
        </button>
      )}
      <button type="button" className="btn btn-ghost button-sm" onClick={toggleGuideSteps} aria-expanded={open}>
        {open ? 'Hide steps' : 'All steps'}
      </button>
      <button type="button" className="btn btn-ghost button-sm h-9 w-9 !p-0" onClick={hideGuide} aria-label="Hide the demo tour">
        <CloseIcon size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

/** The four steps, shown under the greeting when "All steps" is open. */
export function TourSteps() {
  const { isDemo, state } = useAppState()
  const router = useRouter()
  if (!isDemo || state.guideHidden || !state.guideOpen) return null
  const next = state.guide.indexOf(false)

  return (
    <div className="pop grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {STEPS.map((s, i) => (
        <button key={s.title} type="button" className={`step${i === next ? ' step-next' : ''}`} onClick={() => router.push(s.href)}>
          <span
            className="caption-3 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
            style={
              state.guide[i]
                ? { background: '#6FE3C6', color: '#000000' }
                : i === next
                  ? { background: '#FFFFFF', color: '#000000' }
                  : { background: 'rgba(255,255,255,.12)', color: 'rgba(255,255,255,.72)' }
            }
          >
            {state.guide[i] ? <CheckIcon size={12} aria-hidden="true" /> : i + 1}
          </span>
          <span className="min-w-0">
            <span className="body-4 block">{s.title}</span>
            <span className="caption-5 mt-1 block text-ink-2">{s.sub}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
