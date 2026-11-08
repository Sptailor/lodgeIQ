const PHOTOGRAPHERS = [
  'Rafael Peier', 'Pew Nguyen', 'Marie Dehayes', 'Shaain Ibrahim', 'Ben Kupke', 'Puscas Adryan', 'Jasmeet Singh', 'A', 'Ahmed Galal',
  'Marc Wieland', 'Aalo Lens', 'Josh Hild', 'Andy Wang', 'Dave Photoz', 'Olga Serjantu', 'Mirko Meister', 'Harman Tatla', 'Zeng Yili',
]

const credit = `${PHOTOGRAPHERS.slice(0, -1).join(', ')} and ${PHOTOGRAPHERS[PHOTOGRAPHERS.length - 1]}`

export function LandingFooter() {
  return (
    <footer className="sec" style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 48px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <p className="caption-2" style={{ color: '#A3A3A3' }}>
        LodgeIQ, hotel and lodge inspections for tour operators
      </p>
      <p className="caption-5" style={{ color: '#737373', maxWidth: 880 }}>
        Photos from Unsplash by {credit}. Properties shown are samples.
      </p>
    </footer>
  )
}
