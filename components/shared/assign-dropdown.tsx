'use client'

import { useEffect, useRef, useState } from 'react'
import { useMainRef } from '@/components/app/AppShell'
import { useAppState } from '@/components/app/AppState'
import { CaretIcon, SearchIcon } from '@/components/shared/icon'
import { ASSIGN_OWNERS } from '@/lib/domain/sample-data'

/**
 * Assign a follow up to a person or team.
 * A fixed size panel (280px wide, a 160px list that scrolls inside it), a search field,
 * and it opens upwards when there is no room below. Click outside, Escape or picking someone closes it.
 */
export function AssignDropdown({ followUpId, align = 'right' }: { followUpId: string; align?: 'left' | 'right' }) {
  const { assignFollowUp } = useAppState()
  const mainRef = useMainRef()
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!open) {
      const r = e.currentTarget.getBoundingClientRect()
      const m = mainRef.current?.getBoundingClientRect()
      setUp(!!m && m.bottom - r.bottom < 232 && r.top - m.top > 232)
      setQ('')
    }
    setOpen(!open)
  }

  const query = q.trim().toLowerCase()
  const people = ASSIGN_OWNERS.filter((o) => !query || o.name.toLowerCase().includes(query) || o.role.toLowerCase().includes(query))

  const pick = async (name: string) => {
    setOpen(false)
    await assignFollowUp(followUpId, name)
  }

  return (
    <div className="relative z-[5] flex-none">
      <button type="button" className="btn btn-primary button-sm" onClick={toggle} aria-expanded={open} aria-haspopup="dialog">
        Assign
        <CaretIcon size={12} className="chev" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined }} />
      </button>
      {open && (
        <>
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 -z-10" />
          <div
            role="dialog"
            aria-label="Assign to"
            className={`pop absolute z-[5] box-border w-[280px] rounded-md border border-line-2 p-2 ${align === 'right' ? 'right-0' : 'left-0'} ${up ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'}`}
          >
            <label className="flex items-center gap-2 rounded-sm border border-line-2 px-2 py-1" style={{ background: 'rgba(0,0,0,.3)' }}>
              <SearchIcon size={16} color="rgba(255,255,255,.56)" aria-hidden="true" />
              <span className="sr-only">Find a person</span>
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.stopPropagation()
                    setOpen(false)
                  }
                }}
                placeholder="Find a person or team"
                className="body-6 min-w-0 flex-1 border-0 bg-transparent py-1 text-ink outline-none placeholder:text-ink-3"
              />
            </label>
            <div role="listbox" aria-label="People" className="scroll mt-1 h-40 overflow-y-auto">
              {people.map((o) => (
                <button key={o.name} type="button" role="option" aria-selected={false} className="sugg h-10 justify-start gap-2 px-2 py-1" onClick={() => pick(o.name)}>
                  <span
                    className="caption-3 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full"
                    aria-hidden="true"
                    style={o.team ? { background: 'rgba(255,255,255,.12)', color: '#FFFFFF' } : { background: '#6FE3C6', color: '#000000' }}
                  >
                    {o.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span className="body-5 whitespace-nowrap">{o.name}</span>
                  <span className="caption-5 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-ink-3">{o.role}</span>
                </button>
              ))}
              {people.length === 0 && <p className="caption-2 p-2 text-ink-2">Nobody matches. Try a name or a role.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
