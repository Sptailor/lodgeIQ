/**
 * Logo Preview Page
 *
 * Preview all logo design options
 */

'use client'

import { Logo } from '@/components/Logo'

export default function LogoPreview() {
  const designs = [
    { name: 'hotel-check', label: 'Design 1: Hotel with Checkmark', description: 'Hotel building with inspection checkmark badge' },
    { name: 'minimalist', label: 'Design 2: Minimalist L+IQ', description: 'Clean typography - L shape with IQ letters' },
    { name: 'monogram', label: 'Design 3: Monogram Badge', description: 'LIQ initials in a circle badge - luxury style' },
    { name: 'building-star', label: 'Design 4: Building with Star', description: 'Hotel building with premium quality star' },
    { name: 'key-badge', label: 'Design 5: Key Badge', description: 'Key symbol representing access and quality control' },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          LodgeIQ Logo Designs
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12">
          Choose your preferred logo design
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => (
            <div
              key={design.name}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border-2 border-neutral-200 dark:border-neutral-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
            >
              {/* Logo on white background */}
              <div className="bg-white rounded-xl p-8 mb-4 flex items-center justify-center">
                <Logo
                  className="w-24 h-24 text-primary-600"
                  design={design.name}
                  variant="icon"
                />
              </div>

              {/* Logo on dark background */}
              <div className="bg-neutral-900 rounded-xl p-8 mb-4 flex items-center justify-center">
                <Logo
                  className="w-24 h-24 text-white"
                  design={design.name}
                  variant="icon"
                />
              </div>

              {/* Logo on colored background */}
              <div className="bg-gradient-to-br from-primary-600 to-tertiary-600 rounded-xl p-8 mb-6 flex items-center justify-center">
                <Logo
                  className="w-24 h-24 text-white"
                  design={design.name}
                  variant="icon"
                />
              </div>

              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {design.label}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {design.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border-2 border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-neutral-600 dark:text-neutral-400">
            <li>Review each design above shown in 3 contexts: light background, dark background, and colored background</li>
            <li>Pick your favorite design (1-5)</li>
            <li>Tell me which design number you prefer</li>
            <li>I'll update the logo throughout the app with your chosen design</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
