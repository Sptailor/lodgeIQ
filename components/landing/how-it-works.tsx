const STEPS = [
  ['Inspect on site', 'The inspector works through nine checks on their phone and photographs what they find.'],
  ['Score it the same way everywhere', 'Weighted checks turn every visit into one score out of five, comparable across countries.'],
  ['Act on what slipped', 'Failed checks become follow ups with a due date, and the property gets a report it can act on.'],
]

export function HowItWorks() {
  return (
    <section className="sec" aria-labelledby="how-h" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px 32px', boxSizing: 'border-box' }}>
      <h2 id="how-h" className="heading-3">
        How it works
      </h2>
      <div className="grid-3" style={{ marginTop: 32 }}>
        {STEPS.map(([t, d], i) => (
          <div key={t} style={{ borderTop: '1px solid #313131', paddingTop: 24 }}>
            <p className="heading-3" style={{ color: '#2FC6C9' }}>
              {i + 1}
            </p>
            <p className="heading-6" style={{ marginTop: 16 }}>
              {t}
            </p>
            <p className="body-3" style={{ marginTop: 8, color: '#A3A3A3' }}>
              {d}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
