'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/app/actions'
import { BrandMark } from '@/components/shared/brand-mark'
import { CalendarIcon, FollowIcon, GlobeIcon, OverviewIcon, ReportsIcon } from '@/components/shared/icon'
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
    <nav aria-label="Main" className="glass relative z-[2] my-4 ml-4 flex w-[240px] shrink-0 flex-col gap-8 rounded-xl px-4 py-6 max-xl:w-[72px] max-xl:px-3 max-md:hidden">
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

      <div className="mt-auto flex flex-col gap-3 rounded-md border border-line-2 p-4 max-xl:hidden">
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
    </nav>
  )
}

/** Phone navigation: five icons with labels along the bottom edge. */
export function BottomTabs() {
  const pathname = usePathname()
  const active = navIndex(pathname)
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-[6] hidden h-16 items-stretch justify-around max-md:flex" style={{ background: '#121415', borderTop: '1px solid rgba(255,255,255,.12)' }}>
      {NAV.map(({ href, label, Icon }, i) => (
        <Link key={href} href={href} aria-current={i === active ? 'page' : undefined} className="caption-5 flex min-w-0 flex-1 flex-col items-center justify-center gap-1 no-underline" style={{ color: i === active ? '#FFFFFF' : 'rgba(255,255,255,.56)' }}>
          <Icon size={22} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
