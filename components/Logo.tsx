/**
 * LodgeIQ Custom Logo Component
 *
 * Custom SVG logo combining hotel (building) and inspection (checkmark) elements
 * Clean, modern, professional design
 */

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
}

export function Logo({ className = '', variant = 'icon' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.1" />

        {/* Hotel building outline */}
        <path
          d="M14 28V14C14 13.4477 14.4477 13 15 13H25C25.5523 13 26 13.4477 26 14V28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Windows */}
        <rect x="16" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="16" y="20" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="20" width="2" height="2" rx="0.5" fill="currentColor" />

        {/* Door */}
        <rect x="18.5" y="24" width="3" height="4" rx="0.5" fill="currentColor" />

        {/* Inspection checkmark badge */}
        <circle cx="28" cy="15" r="5" fill="currentColor" />
        <path
          d="M26.5 15L27.5 16L29.5 14"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Base line */}
        <line
          x1="12"
          y1="28"
          x2="28"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon part */}
      <g>
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.1" />

        {/* Hotel building outline */}
        <path
          d="M14 28V14C14 13.4477 14.4477 13 15 13H25C25.5523 13 26 13.4477 26 14V28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Windows */}
        <rect x="16" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="16" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="16" y="20" width="2" height="2" rx="0.5" fill="currentColor" />
        <rect x="22" y="20" width="2" height="2" rx="0.5" fill="currentColor" />

        {/* Door */}
        <rect x="18.5" y="24" width="3" height="4" rx="0.5" fill="currentColor" />

        {/* Inspection checkmark badge */}
        <circle cx="28" cy="15" r="5" fill="currentColor" />
        <path
          d="M26.5 15L27.5 16L29.5 14"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Base line */}
        <line
          x1="12"
          y1="28"
          x2="28"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Text part - LodgeIQ */}
      <text
        x="50"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
      >
        LodgeIQ
      </text>
    </svg>
  )
}
