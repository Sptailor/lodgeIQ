'use client'

import { useState } from 'react'
import { Reveal } from './reveal'

const FAQS = [
  ['Who is LodgeIQ for?', 'Tour operators and destination companies that contract hotels, lodges and camps and need to know each one meets their standard before they sell it.'],
  ['What can I do in the demo?', 'Everything. You are signed in as an operations manager with 20 sample properties, and your changes stay in your browser tab.'],
  ['How is the score worked out?', 'Each visit runs nine checks across cleanliness, safety and amenities. Every check has a weight, so a failed fire check counts four times as much as the TV.'],
  ['Do inspectors need to install an app?', 'No. The checklist runs in the phone browser, with photos taken straight from the camera.'],
  ['Can properties see their results?', 'You can export any inspection as a PDF with every result and the inspector notes, ready to send to the property.'],
]

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <Reveal id="faq" className="sec">
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box' }}>
        <h2 className="heading-2">Questions</h2>
        <div style={{ marginTop: 32, borderTop: '1px solid #272727' }}>
          {FAQS.map(([q, a], i) => {
            const on = open === i
            return (
              <div key={q} style={{ borderBottom: '1px solid #272727' }}>
                <h3 style={{ margin: 0 }}>
                  <button type="button" className="faq-q" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                    <span className="title-2">{q}</span>
                    <span className="faq-ic" style={{ background: on ? '#FFFFFF' : '#181818', color: on ? '#000000' : '#FFFFFF', transform: `rotate(${on ? 45 : 0}deg)` }}>
                      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                      </svg>
                    </span>
                  </button>
                </h3>
                {on && (
                  <p className="body-3" style={{ color: '#A3A3A3', padding: '0 48px 24px 0', margin: 0 }}>
                    {a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}
