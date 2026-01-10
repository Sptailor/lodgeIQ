/**
 * LodgeIQ Custom Logo Component
 *
 * Multiple logo design options
 */

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
  design?: 'hotel-check' | 'minimalist' | 'monogram' | 'building-star' | 'key-badge'
}

export function Logo({ className = '', variant = 'icon', design = 'hotel-check' }: LogoProps) {

  // Design 1: Hotel with Checkmark Badge (Current)
  if (design === 'hotel-check') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.1" />
        <path
          d="M14 28V14C14 13.4477 14.4477 13 15 13H25C25.5523 13 26 13.4477 26 14V28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="16" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="16" y="20" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="20" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="18.5" y="24" width="3" height="4" rx="0.5" fill="currentColor" />
        <circle cx="28" cy="15" r="5" fill="currentColor" />
        <path
          d="M26.5 15L27.5 16L29.5 14"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="12" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  // Design 2: Minimalist L+IQ
  if (design === 'minimalist') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="8" y="8" width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.1" />
        {/* L shape */}
        <path
          d="M14 12V24H18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* IQ */}
        <line x1="22" y1="16" x2="22" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="13" r="1.5" fill="currentColor" />
        <path
          d="M26 16C26 16 26 20 26 21C26 22 27 23 28 23"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  // Design 3: Monogram Badge (LIQ)
  if (design === 'monogram') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="16" fill="currentColor" fillOpacity="0.1" />
        <text
          x="20"
          y="26"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="currentColor"
          textAnchor="middle"
        >
          LIQ
        </text>
      </svg>
    )
  }

  // Design 4: Building with Star (Premium Quality)
  if (design === 'building-star') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="4" y="4" width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1" />
        {/* Building */}
        <rect x="13" y="16" width="14" height="13" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="16" y="19" width="2" height="2" fill="currentColor" />
        <rect x="22" y="19" width="2" height="2" fill="currentColor" />
        <rect x="16" y="23" width="2" height="2" fill="currentColor" />
        <rect x="22" y="23" width="2" height="2" fill="currentColor" />
        <rect x="18.5" y="26" width="3" height="3" fill="currentColor" />
        {/* Star */}
        <path
          d="M20 8L21.5 12.5L26 13L22.5 16L23.5 20.5L20 18L16.5 20.5L17.5 16L14 13L18.5 12.5L20 8Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  // Design 5: Key Badge (Access/Quality Control)
  if (design === 'key-badge') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.1" />
        <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" />
        {/* Key */}
        <circle cx="16" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
        <path
          d="M18.5 19.5L26 27"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="23" y1="24" x2="23" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="26" x2="27" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return null
}
