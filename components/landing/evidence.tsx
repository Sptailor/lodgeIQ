import Image from 'next/image'
import { CHIP, LABEL, type Res } from './landing-math'
import { Reveal } from './reveal'

const EVIDENCE: { img: string; alt: string; check: string; r: Res; note: string }[] = [
  { img: '/images/evidence-bathroom.jpg', alt: 'A clean hotel bathroom with marble and wood', check: 'Bathroom cleanliness', r: 'p', note: 'Clean throughout. Grout checked behind the door.' },
  { img: '/images/evidence-extinguisher.jpg', alt: 'A fire extinguisher mounted on a wall', check: 'Fire safety equipment', r: 'f', note: 'Service tag expired in March. Follow up opened.' },
  { img: '/images/evidence-corridor.jpg', alt: 'A long hotel corridor with a clock on the wall', check: 'Emergency information', r: 'n', note: 'Evacuation map missing in two rooms on this floor.' },
]

const panel: React.CSSProperties = { background: '#181818', border: '1px solid #272727', borderRadius: 24, padding: 32 }

export function Evidence() {
  return (
    <Reveal id="evidence" className="sec">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 48px', boxSizing: 'border-box' }}>
        <h2 className="heading-2" style={{ maxWidth: 680 }}>
          Evidence, not opinions.
        </h2>
        <p className="title-2" style={{ maxWidth: 560, marginTop: 16, color: '#A3A3A3' }}>
          Every result carries the photo that proves it, so a supplier can&apos;t argue with a fail.
        </p>
        <div className="bento" style={{ marginTop: 48 }}>
          {EVIDENCE.map((e) => (
            <figure key={e.check} className="ev" style={{ margin: 0 }}>
              <Image src={e.img} alt={e.alt} fill sizes="(max-width: 767px) 100vw, 400px" loading="lazy" style={{ objectFit: 'cover' }} />
              <figcaption className="glass" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 16, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span className="body-4">{e.check}</span>
                  <span className="caption-3" style={{ flex: 'none', borderRadius: 9999, padding: '2px 8px', ...CHIP[e.r] }}>
                    {LABEL[e.r]}
                  </span>
                </div>
                <p className="caption-5" style={{ color: '#D4D4D4', marginTop: 4 }}>
                  {e.note}
                </p>
              </figcaption>
            </figure>
          ))}
          <div className="span2" style={{ ...panel, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <p className="heading-5">Failed checks become follow ups</p>
              <p className="body-3" style={{ marginTop: 8, color: '#A3A3A3' }}>
                Each fail opens a follow up with an owner and a due date. Send the property a PDF report with every result and photo, and see when it is fixed.
              </p>
            </div>
            <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['#E5604A', 'Replace expired fire extinguishers, floors 9 to 14', 'Tokyo Imperial Suites. Due Fri 14 Nov'],
                ['#F0B23E', 'Add evacuation maps to rooms 1204 and 1207', 'Tokyo Imperial Suites. Due Fri 21 Nov'],
              ].map(([c, t, m]) => (
                <div key={t} style={{ border: `1px solid ${c}`, borderRadius: 12, padding: '12px 16px' }}>
                  <p className="body-4">{t}</p>
                  <p className="caption-5" style={{ color: '#A3A3A3', marginTop: 4 }}>
                    {m}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...panel, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
            <p className="heading-5">Works on the phone</p>
            <p className="body-3" style={{ color: '#A3A3A3' }}>
              Nine weighted checks, one at a time, with the camera a tap away.
            </p>
            <a className="btn btn-quiet button-sm" href="/demo?next=/app/properties/ewaso-river-camp/inspect" style={{ alignSelf: 'flex-start' }}>
              Try the phone checklist
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
