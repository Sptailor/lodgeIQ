'use client'

import { useRouter } from 'next/navigation'
import { BellIcon } from '@/components/shared/icon'
import { relativeTime } from '@/lib/domain/format'
import { useAppState } from './AppState'

/** Recent field activity. Each item opens what it refers to. */
export function ActivityBell() {
  const { state, now, ui, readNote, readAllNotes } = useAppState()
  const router = useRouter()
  const unread = state.notes.filter((n) => n.unread).length

  return (
    <div className="relative">
      <button
        type="button"
        className="bell"
        onClick={() => ui.setBellOpen(!ui.bellOpen)}
        aria-expanded={ui.bellOpen}
        aria-label={`Activity, ${unread ? `${unread} unread` : 'nothing new'}`}
      >
        <BellIcon size={20} aria-hidden="true" />
        {unread > 0 && (
          // The key makes the badge pop again whenever the count changes.
          <span key={unread} className="badge caption-3">
            {unread}
          </span>
        )}
      </button>

      {ui.bellOpen && (
        <>
          <div aria-hidden="true" onClick={() => ui.setBellOpen(false)} className="fixed inset-0 z-[4]" />
          <div role="dialog" aria-label="Activity" className="pop absolute right-0 top-[calc(100%+8px)] z-[5] box-border w-[400px] overflow-hidden rounded-lg border border-line-2">
            <div className="flex items-center justify-between px-4 pb-3 pt-4">
              <p className="body-1">Activity</p>
              <button type="button" className="btn btn-ghost button-sm" onClick={readAllNotes} disabled={unread === 0}>
                Mark all as read
              </button>
            </div>
            <div className="scroll max-h-[400px] overflow-y-auto px-2 pb-2">
              {state.notes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className="note"
                  onClick={() => {
                    readNote(n.id)
                    ui.setBellOpen(false)
                    if (n.propertyId) router.push(`/app/properties/${n.propertyId}`)
                  }}
                >
                  <span className="caption-3 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full" aria-hidden="true" style={{ background: n.color, color: '#05080A' }}>
                    {n.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="body-6 block">
                      <span className="font-semibold">{n.actor}</span> {n.text}
                    </span>
                    <span className="caption-5 mt-[2px] block text-ink-3">{relativeTime(n.at, now)}</span>
                  </span>
                  {n.unread && <span aria-label="Unread" className="h-2 w-2 flex-none rounded-full" style={{ background: '#6FE3C6' }} />}
                </button>
              ))}
              {state.notes.length === 0 && <p className="body-6 p-4 text-ink-2">Nothing yet. Activity from your inspectors appears here.</p>}
            </div>
            <p className="caption-5 border-t border-line px-4 py-3 text-ink-3">Select an item to open what it refers to.</p>
          </div>
        </>
      )}
    </div>
  )
}
