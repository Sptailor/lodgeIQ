import { BrandMark } from '@/components/shared/brand-mark'

/** The floating glass pill with anchor links. */
export function LandingNav() {
  return (
    <header className="glass" style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 9999, whiteSpace: 'nowrap' }}>
      <a href="#top" aria-label="LodgeIQ home" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 12px 0 8px', textDecoration: 'none', color: '#FFFFFF' }}>
        <BrandMark size={24} a="#2FC6C9" b="#F0B23E" />
        <span className="body-1">LodgeIQ</span>
      </a>
      <nav className="nav-links" aria-label="Site">
        <a className="navlink body-5" href="#properties">Properties</a>
        <a className="navlink body-5" href="#evidence">Evidence</a>
        <a className="navlink body-5" href="#globe">Portfolio</a>
        <a className="navlink body-5" href="#try">Try the score</a>
      </nav>
      <a className="btn btn-primary button-sm" href="/demo">
        Explore the live demo
      </a>
    </header>
  )
}
