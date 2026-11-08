import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#0B0C0D',
        panel: '#141617',
        rail: '#121415',
        hover: '#1C1F21',
        ink: '#FFFFFF',
        'ink-2': 'rgba(255,255,255,0.72)',
        'ink-3': 'rgba(255,255,255,0.56)',
        'ink-4': 'rgba(255,255,255,0.36)',
        line: 'rgba(255,255,255,0.07)',
        'line-2': 'rgba(255,255,255,0.12)',
        pass: '#6FE3C6',
        warn: '#FFC56B',
        fail: '#FF8A7A',
        'fail-ink': '#FFC2B8',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
