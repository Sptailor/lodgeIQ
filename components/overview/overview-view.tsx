'use client'

import { Greeting } from './greeting'
import { LatestInspections } from './latest-inspections'
import { NeedsYou } from './needs-you'
import { KeyFigures, PortfolioScore } from './portfolio-score'
import { ThisWeek } from './this-week'
import { WaitingOnYou } from './waiting-on-you'

export function OverviewView() {
  return (
    <div className="fade flex flex-col gap-6 px-10 pb-12 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Greeting />
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start gap-6 max-lg:grid-cols-1">
        <NeedsYou />
        <div className="flex flex-col gap-4">
          <PortfolioScore />
          <KeyFigures />
        </div>
      </div>
      <div className="grid grid-cols-3 items-start gap-6 max-lg:grid-cols-1">
        <WaitingOnYou />
        <ThisWeek />
        <LatestInspections />
      </div>
    </div>
  )
}
