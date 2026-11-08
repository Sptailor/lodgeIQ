import { LiveCard } from './live-card'

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" style={{ position: 'relative', minHeight: 720, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="kb" src="/images/lodge-blue-hour.jpg" alt="A thatched safari lodge lit by lanterns at dusk, beside a still pool" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)' }} />
      <div className="sec" style={{ position: 'relative', width: '100%', maxWidth: 1280, margin: '0 auto', padding: '96px 48px 64px', boxSizing: 'border-box' }}>
        <h1 className="heading-1 hero-grad" style={{ maxWidth: 680 }}>
          Know every property
          <br />
          before your guests do.
        </h1>
        <p className="title-1" style={{ maxWidth: 680, marginTop: 24, color: '#E5E5E5' }}>
          LodgeIQ gives tour operators one inspection standard for every lodge, camp and hotel they sell. Inspectors score it on their phone. You see the whole portfolio at once.
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <a className="btn btn-primary button-md" href="/demo">
            Explore the live demo
          </a>
          <p className="caption-2" style={{ color: '#D4D4D4' }}>
            No sign up and no card. Try it with 20 sample properties. Your changes stay in your browser tab.
          </p>
        </div>
        <LiveCard />
      </div>
    </section>
  )
}
