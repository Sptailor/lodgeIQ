'use client'

import { useAppState } from '@/components/app/AppState'
import { countWord, greetingWord, longDate } from '@/lib/domain/format'
import { attn } from '@/lib/domain/derive'

/** The date, and a greeting that builds word by word each time you arrive on Overview. */
export function Greeting() {
  const { user, state, now, ready } = useAppState()
  const n = state.properties.filter((p) => attn(p, now)).length
  // The server cannot know the visitor's local time, so it says "morning" until the browser takes over.
  const word = greetingWord(ready ? now.getHours() : 9)
  const text =
    `Good ${word}, ${user.firstName}. ` +
    (n === 0 ? 'Every property is on track.' : `${n === 1 ? 'One property needs' : `${countWord(n)} properties need`} you this week.`)

  return (
    <div className="min-w-0">
      <p className="caption-2 text-ink-2">{longDate(now)}</p>
      <h1 className="heading-4 mt-1" aria-label={text}>
        {text.split(' ').map((w, i) => (
          <span key={i} className="word" aria-hidden="true" style={{ animationDelay: `${i * 70}ms` }}>
            {w}
          </span>
        ))}
      </h1>
    </div>
  )
}
