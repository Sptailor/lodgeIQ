'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from '@/components/shared/icon'
import { latest, tone } from '@/lib/domain/derive'
import { useAppState } from './AppState'
import { NAV } from './Sidebar'

type Item = { key: string; name: string; sub: string; score: string; color: string; href: string }

/** Search for a property or a page. Opens with Ctrl K or the search button. */
export function CommandPalette() {
  const { ui } = useAppState()
  if (!ui.paletteOpen) return null
  return <PaletteDialog />
}

function PaletteDialog() {
  const { state, ui } = useAppState()
  const router = useRouter()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const query = q.trim().toLowerCase()
  const props: Item[] = state.properties
    .filter((p) => !query || p.name.toLowerCase().includes(query) || p.place.toLowerCase().includes(query))
    .slice(0, query ? 8 : 4)
    .map((p) => {
      const s = latest(p).score
      return { key: p.id, name: p.name, sub: p.place, score: s.toFixed(1), color: tone(s), href: `/app/properties/${p.id}` }
    })
  const pages: Item[] = NAV.filter((n) => !query || n.label.toLowerCase().includes(query)).map((n) => ({
    key: n.href,
    name: n.label,
    sub: 'Page',
    score: '',
    color: '',
    href: n.href,
  }))
  const items = [...props, ...pages]

  const go = (item: Item) => {
    ui.setPaletteOpen(false)
    router.push(item.href)
  }

  return (
    <div
      onClick={() => ui.setPaletteOpen(false)}
      className="fixed inset-0 z-30 flex items-start justify-center pt-24"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Find"
        onClick={(e) => e.stopPropagation()}
        className="pop w-[640px] max-w-[calc(100%-32px)] overflow-hidden rounded-lg border border-line-2"
      >
        <label className="flex items-center gap-3 border-b border-line-2 p-4">
          <SearchIcon size={20} color="#6FE3C6" aria-hidden="true" />
          <span className="sr-only">Find a property or a page</span>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && items[0]) go(items[0])
            }}
            placeholder="Try ewaso, kenya or reports"
            className="title-3 min-w-0 flex-1 border-0 bg-transparent text-ink outline-none placeholder:text-ink-3"
          />
          <span className="caption-3 rounded-[4px] px-1 py-[2px] text-ink-2" style={{ border: '1px solid rgba(255,255,255,.18)' }}>
            Esc
          </span>
        </label>
        <div className="scroll max-h-[360px] overflow-auto p-2">
          {items.map((it) => (
            <button key={it.key} type="button" className="sugg" onClick={() => go(it)}>
              <span>
                <span className="body-4">{it.name}</span> <span className="caption-5 text-ink-3">{it.sub}</span>
              </span>
              {it.score && (
                <span className="body-4" style={{ color: it.color }}>
                  {it.score}
                </span>
              )}
            </button>
          ))}
          {items.length === 0 && <p className="body-6 p-3 text-ink-2">Nothing matches. Try a property name, a city or a page like reports.</p>}
        </div>
      </div>
    </div>
  )
}
