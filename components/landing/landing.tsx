import '@/styles/landing.css'
import { Evidence } from './evidence'
import { GlobeSection } from './globe-section'
import { Hero } from './hero'
import { HowItWorks } from './how-it-works'
import { LandingNav } from './nav'
import { PropertyStrip } from './property-strip'
import { Tagline } from './tagline'

/** The public landing page. Every colour and class is scoped under .lp. */
export function Landing() {
  return (
    <div className="lp" style={{ fontFamily: 'var(--font-geist-sans), Geist, sans-serif', color: '#FFFFFF', background: '#000000', fontVariantNumeric: 'tabular-nums', position: 'relative' }}>
      <a className="skip button-sm" href="#main">
        Skip to content
      </a>
      <LandingNav />
      <main id="main">
        <Hero />
        <PropertyStrip />
        <Tagline />
        <Evidence />
        <HowItWorks />
        <GlobeSection />
      </main>
    </div>
  )
}
