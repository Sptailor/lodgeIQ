/**
 * Logo Preview Page
 */

'use client'

import { Logo } from '@/components/Logo'

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          LodgeIQ Logo Preview
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-12">
          Preview your new logo design in different contexts
        </p>

        <div className="space-y-8">
          {/* Icon only - Light background */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Icon Only - Light Background</h3>
            <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-xl">
              <Logo className="w-32 h-24 text-neutral-800" />
            </div>
          </div>

          {/* Icon only - Dark background */}
          <div className="bg-neutral-900 rounded-2xl p-8 shadow-lg border-2 border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4">Icon Only - Dark Background</h3>
            <div className="flex items-center justify-center p-8 bg-neutral-800 rounded-xl">
              <Logo className="w-32 h-24 text-white" />
            </div>
          </div>

          {/* Icon only - Colored background (header simulation) */}
          <div className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Icon Only - Header Background</h3>
            <div className="flex items-center justify-center p-8">
              <Logo className="w-32 h-24 text-white" />
            </div>
          </div>

          {/* Full logo with text - Light background */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Full Logo with Text - Light Background</h3>
            <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-xl">
              <Logo className="w-96 h-48 text-neutral-800" showText={true} />
            </div>
          </div>

          {/* Full logo with text - Dark background */}
          <div className="bg-neutral-900 rounded-2xl p-8 shadow-lg border-2 border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4">Full Logo with Text - Dark Background</h3>
            <div className="flex items-center justify-center p-8 bg-neutral-800 rounded-xl">
              <Logo className="w-96 h-48 text-white" showText={true} />
            </div>
          </div>

          {/* Size comparison */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Size Comparison</h3>
            <div className="flex items-center justify-around p-8 bg-neutral-50 rounded-xl">
              <div className="text-center">
                <Logo className="w-16 h-12 text-neutral-800 mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Small</p>
              </div>
              <div className="text-center">
                <Logo className="w-24 h-18 text-neutral-800 mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Medium</p>
              </div>
              <div className="text-center">
                <Logo className="w-32 h-24 text-neutral-800 mx-auto mb-2" />
                <p className="text-xs text-neutral-600">Large</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 dark:bg-blue-950 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
            Next Steps
          </h2>
          <p className="text-blue-800 dark:text-blue-200">
            If you're happy with this logo, let me know and I'll integrate it throughout the app (header, mobile nav, etc.). If you want changes, just tell me what to adjust!
          </p>
        </div>
      </div>
    </div>
  )
}
