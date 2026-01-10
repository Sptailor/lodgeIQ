/**
 * LodgeIQ Logo Component
 *
 * Hotel building with 4 stars design
 */

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = '', showText = false }: LogoProps) {
  if (showText) {
    return (
      <svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Stars */}
        <g transform="translate(140, 10)">
          <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
        </g>
        <g transform="translate(170, 10)">
          <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
        </g>
        <g transform="translate(200, 10)">
          <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
        </g>
        <g transform="translate(230, 10)">
          <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
        </g>

        {/* Hotel Building */}
        <g transform="translate(120, 40)">
          {/* Main building */}
          <rect x="40" y="20" width="80" height="80" fill="currentColor" opacity="0.8" />

          {/* Left wing */}
          <rect x="10" y="35" width="30" height="65" fill="currentColor" opacity="0.6" />

          {/* Right wing */}
          <rect x="120" y="35" width="30" height="65" fill="currentColor" opacity="0.6" />

          {/* Windows - main building (3x3 grid) */}
          <rect x="50" y="30" width="8" height="10" fill="white" />
          <rect x="66" y="30" width="8" height="10" fill="white" />
          <rect x="82" y="30" width="8" height="10" fill="white" />

          <rect x="50" y="48" width="8" height="10" fill="white" />
          <rect x="66" y="48" width="8" height="10" fill="white" />
          <rect x="82" y="48" width="8" height="10" fill="white" />

          <rect x="50" y="66" width="8" height="10" fill="white" />
          <rect x="66" y="66" width="8" height="10" fill="white" />
          <rect x="82" y="66" width="8" height="10" fill="white" />

          {/* Windows - left wing */}
          <rect x="16" y="45" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="16" y="58" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="16" y="71" width="6" height="8" fill="white" opacity="0.8" />

          <rect x="28" y="45" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="28" y="58" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="28" y="71" width="6" height="8" fill="white" opacity="0.8" />

          {/* Windows - right wing */}
          <rect x="126" y="45" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="126" y="58" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="126" y="71" width="6" height="8" fill="white" opacity="0.8" />

          <rect x="138" y="45" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="138" y="58" width="6" height="8" fill="white" opacity="0.8" />
          <rect x="138" y="71" width="6" height="8" fill="white" opacity="0.8" />

          {/* Door */}
          <rect x="70" y="84" width="20" height="16" fill="black" opacity="0.4" />
        </g>

        {/* LODGE IQ Text */}
        <text
          x="200"
          y="155"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="42"
          fontWeight="700"
          fill="currentColor"
          textAnchor="middle"
          letterSpacing="4"
        >
          LODGE IQ
        </text>

        {/* Tagline */}
        <text
          x="200"
          y="180"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="14"
          fontWeight="400"
          fill="currentColor"
          opacity="0.7"
          textAnchor="middle"
        >
          Smarter Hotel Inspections
        </text>
      </svg>
    )
  }

  // Icon only version
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stars */}
      <g transform="translate(20, 5)">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
      </g>
      <g transform="translate(50, 5)">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
      </g>
      <g transform="translate(80, 5)">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
      </g>
      <g transform="translate(110, 5)">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
      </g>

      {/* Hotel Building */}
      <g transform="translate(0, 30)">
        {/* Main building */}
        <rect x="40" y="20" width="80" height="70" fill="currentColor" opacity="0.8" />

        {/* Left wing */}
        <rect x="10" y="35" width="30" height="55" fill="currentColor" opacity="0.6" />

        {/* Right wing */}
        <rect x="120" y="35" width="30" height="55" fill="currentColor" opacity="0.6" />

        {/* Windows - main building */}
        <rect x="50" y="30" width="8" height="10" fill="white" />
        <rect x="66" y="30" width="8" height="10" fill="white" />
        <rect x="82" y="30" width="8" height="10" fill="white" />

        <rect x="50" y="48" width="8" height="10" fill="white" />
        <rect x="66" y="48" width="8" height="10" fill="white" />
        <rect x="82" y="48" width="8" height="10" fill="white" />

        <rect x="50" y="66" width="8" height="10" fill="white" />
        <rect x="66" y="66" width="8" height="10" fill="white" />
        <rect x="82" y="66" width="8" height="10" fill="white" />

        {/* Windows - left wing */}
        <rect x="16" y="45" width="6" height="8" fill="white" opacity="0.8" />
        <rect x="16" y="58" width="6" height="8" fill="white" opacity="0.8" />

        <rect x="28" y="45" width="6" height="8" fill="white" opacity="0.8" />
        <rect x="28" y="58" width="6" height="8" fill="white" opacity="0.8" />

        {/* Windows - right wing */}
        <rect x="126" y="45" width="6" height="8" fill="white" opacity="0.8" />
        <rect x="126" y="58" width="6" height="8" fill="white" opacity="0.8" />

        <rect x="138" y="45" width="6" height="8" fill="white" opacity="0.8" />
        <rect x="138" y="58" width="6" height="8" fill="white" opacity="0.8" />

        {/* Door */}
        <rect x="70" y="74" width="20" height="16" fill="black" opacity="0.4" />
      </g>
    </svg>
  )
}
