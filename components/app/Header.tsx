'use client'

import { signOutAction } from '@/app/app/actions'
import { SearchIcon } from '@/components/shared/icon'
import { sameUtcDay } from '@/lib/domain/format'
import { DEMO_TEAM } from '@/lib/domain/sample-data'
import { ActivityBell } from './ActivityBell'
import { useAppState } from './AppState'

export function Header() {
  const { user, isDemo, people, state, now, ui, resetDemo } = useAppState()

  // Who is in the field today. The demo shows a fixed team.
  const team = isDemo
    ? DEMO_TEAM
    : (() => {
        const out: { initials: string; tip: string; color: string }[] = []
        for (const v of state.visits) {
          if (!sameUtcDay(v.date, now)) continue
          const person = people.find((p) => p.id === v.inspectorId)
          const prop = state.properties.find((p) => p.id === v.propertyId)
          if (person && prop && !out.some((o) => o.initials === person.initials)) out.push({ initials: person.initials, tip: `${person.name}, visiting ${prop.name}`, color: person.color })
        }
        return out
      })()

  return (
    <header className="relative z-[5] flex items-center gap-4 px-10 py-4 max-md:px-4">
      <button type="button" className="search body-6 max-w-[480px] flex-[1_1_360px] max-md:flex-none max-md:px-3" aria-label="Find a property or a page" onClick={() => ui.setPaletteOpen(true)}>
        <SearchIcon size={20} aria-hidden="true" />
        <span className="flex-1 text-left max-md:hidden">Find a property or a page</span>
        <span className="caption-3 rounded-[4px] px-1 py-[2px] text-ink-2 max-lg:hidden max-md:hidden" style={{ border: '1px solid rgba(255,255,255,.18)' }}>
          Ctrl K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <ActivityBell />
        {team.length > 0 && (
          <div className="mr-4 flex items-center gap-3 max-lg:hidden">
            <span className="caption-2 inline-flex items-center gap-2 text-ink-2">
              <span className="live still" aria-hidden="true" />
              {team.length} in the field
            </span>
            <div className="flex pl-2">
              {team.map((t, i) => (
                <span key={t.initials} className="av caption-3" tabIndex={0} aria-label={t.tip} style={{ background: t.color, color: '#05080A', zIndex: team.length - i }}>
                  {t.initials}
                  <span className="tip caption-3" role="tooltip">
                    {t.tip}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
        <span className="caption-2 text-ink-2 max-md:hidden">
          {user.name}, {user.role}
        </span>
        {/* The sidebar card holds these on wide screens. Narrower screens get them here. */}
        {isDemo ? (
          <button type="button" className="btn btn-quiet button-sm xl:hidden" onClick={resetDemo}>
            Reset demo
          </button>
        ) : (
          <form action={signOutAction} className="xl:hidden">
            <button type="submit" className="btn btn-quiet button-sm">
              Sign out
            </button>
          </form>
        )}
        <span className="body-4 inline-flex h-10 w-10 items-center justify-center rounded-full" aria-hidden="true" style={{ background: '#6FE3C6', color: '#000000' }}>
          {user.initials}
        </span>
      </div>
    </header>
  )
}
