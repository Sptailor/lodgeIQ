'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/app/actions'
import { BrandMark } from '@/components/shared/brand-mark'
import { TOUR_STEPS } from '@/components/overview/tour-pill'
import { CalendarIcon, CheckIcon, FollowIcon, GlobeIcon, OverviewIcon, ReportsIcon } from '@/components/shared/icon'
import { useAppState } from './AppState'

export const NAV = [
  { href: '/app', label: 'Overview', Icon: OverviewIcon },
  { href: '/app/portfolio', label: 'Portfolio', Icon: GlobeIcon },
  { href: '/app/schedule', label: 'Schedule', Icon: CalendarIcon },
  { href: '/app/follow-ups', label: 'Follow ups', Icon: FollowIcon },
  { href: '/app/reports', label: 'Reports', Icon: ReportsIcon },
]

/** Which nav item a path belongs to. Property pages belong to Portfolio. */
export function navIndex(pathname: string): number {
  if (pathname.startsWith('/app/portfolio') || pathname.startsWith('/app/properties')) return 1
  if (pathname.startsWith('/app/schedule')) return 2
  if (pathname.startsWith('/app/follow-ups')) return 3
  if (pathname.startsWith('/app/reports')) return 4
  return 0
}

export function Sidebar() {
  const pathname = usePathname()
  const { state, isDemo, resetDemo } = useAppState()
  const active = navIndex(pathname)
  const openFollowUps = state.followUps.filter((f) => f.status !== 'done').length

  return (
    <nav
      aria-label="Main"
      className="glass scroll relative z-[2] my-4 ml-4 flex w-[240px] shrink-0 flex-col gap-8 overflow-y-auto rounded-xl px-4 py-6 max-xl:w-[72px] max-xl:px-3 max-md:hidden"
    >
      <Link href="/" aria-label="LodgeIQ website" className="flex items-center gap-2 px-3 no-underline max-xl:px-2">
        <BrandMark />
        <span className="body-1 max-xl:hidden">LodgeIQ</span>
      </Link>

      <div className="relative flex flex-col gap-1">
        <span className="ind" aria-hidden="true" style={{ transform: `translateY(${active * 40}px)` }} />
        {NAV.map(({ href, label, Icon }, i) => (
          <Link key={href} href={href} title={label} aria-label={label} className={`nav${i === active ? ' nav-on' : ''}`} aria-current={i === active ? 'page' : undefined}>
            <Icon size={20} aria-hidden="true" />
            <span className="body-5 flex-1 max-xl:hidden">{label}</span>
            {i === 3 && openFollowUps > 0 && (
              <span className="caption-3 rounded-full px-2 py-[2px] max-xl:hidden" style={{ background: '#FFC56B', color: '#000000' }}>
                {openFollowUps}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 max-xl:hidden">
        <SidebarTour />
        <div className="flex flex-col gap-3 rounded-md border border-line-2 p-4">
          {isDemo ? (
            <>
              <div>
                <p className="body-4">Demo workspace</p>
                <p className="caption-5 mt-1 text-ink-2">Try anything. Changes stay in this tab and clear when you leave.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-quiet button-sm" onClick={resetDemo}>
                  Reset demo
                </button>
                <Link href="/" className="btn btn-ghost button-sm">
                  Website
                </Link>
              </div>
            </>
          ) : (
            <form action={signOutAction}>
              <button type="submit" className="btn btn-quiet button-sm">
                Sign out
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  )
}

/**
 * The demo tour, always in view in the sidebar: which step you are on, what is next,
 * and a link to each step. Demo only, and hidden when the visitor closes the tour.
 */
function SidebarTour() {
  const { isDemo, state } = useAppState()
  if (!isDemo || state.guideHidden) return null
  const next = state.guide.indexOf(false)
  const done = next === -1

  return (
    <section aria-label="Demo tour" className="rounded-md border border-line-2 p-2">
      <p className="caption-3 px-2 pb-1 pt-2 text-ink-2">{done ? 'Demo tour complete' : `Demo tour, step ${next + 1} of 4`}</p>
      <ol className="m-0 flex list-none flex-col p-0">
        {TOUR_STEPS.map((s, i) => {
          const isDone = state.guide[i]
          const isNext = i === next
          return (
            <li key={s.title}>
              <Link
                href={s.href}
                aria-current={isNext ? 'step' : undefined}
                className="lift flex items-start gap-3 rounded-sm px-2 py-2 no-underline"
                style={isNext ? { background: 'rgba(255,255,255,.08)' } : undefined}
              >
                <span
                  className="caption-3 mt-[2px] inline-flex h-5 w-5 flex-none items-center justify-center rounded-full"
                  aria-hidden="true"
                  style={
                    isDone
                      ? { background: '#6FE3C6', color: '#000000' }
                      : isNext
                        ? { background: '#FFFFFF', color: '#000000' }
                        : {
                            background: 'rgba(255,255,255,.12)',
                            color: 'rgba(255,255,255,.72)',
                          }
                  }
                >
                  {isDone ? <CheckIcon size={10} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className="body-5 block"
                    style={{
                      color: isNext ? '#FFFFFF' : isDone ? 'rgba(255,255,255,.56)' : 'rgba(255,255,255,.72)',
                    }}
                  >
                    {s.title}
                    <span className="sr-only">{isDone ? ', done' : isNext ? ', next' : ''}</span>
                  </span>
                  {isNext && <span className="caption-5 mt-[2px] block text-ink-2">{s.sub}</span>}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** Phone navigation: five icons with labels along the bottom edge. */
export function BottomTabs() {
  const pathname = usePathname()
  const active = navIndex(pathname)
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-[6] hidden h-16 items-stretch justify-around max-md:flex"
      style={{
        background: '#121415',
        borderTop: '1px solid rgba(255,255,255,.12)',
      }}
    >
      {NAV.map(({ href, label, Icon }, i) => (
        <Link
          key={href}
          href={href}
          aria-current={i === active ? 'page' : undefined}
          className="caption-5 flex min-w-0 flex-1 flex-col items-center justify-center gap-1 no-underline"
          style={{ color: i === active ? '#FFFFFF' : 'rgba(255,255,255,.56)' }}
        >
          <Icon size={22} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
