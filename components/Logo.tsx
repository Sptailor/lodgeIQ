/**
 * LodgeIQ Logo Component
 *
 * Magnifying glass with hotel building and stars design
 */

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Magnifying glass circle */}
      <circle
        cx="45"
        cy="45"
        r="32"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
      />

      {/* Inner circle background */}
      <circle
        cx="45"
        cy="45"
        r="27"
        fill="currentColor"
        opacity="0.1"
      />

      {/* Hotel building */}
      <rect
        x="35"
        y="38"
        width="20"
        height="18"
        fill="currentColor"
      />

      {/* Building windows - top row */}
      <rect x="37" y="40" width="3" height="3" fill="white" />
      <rect x="42" y="40" width="3" height="3" fill="white" />
      <rect x="47" y="40" width="3" height="3" fill="white" />

      {/* Building windows - middle row */}
      <rect x="37" y="45" width="3" height="3" fill="white" />
      <rect x="42" y="45" width="3" height="3" fill="white" />
      <rect x="47" y="45" width="3" height="3" fill="white" />

      {/* Building windows - bottom row */}
      <rect x="37" y="50" width="3" height="3" fill="white" />
      <rect x="42" y="50" width="3" height="3" fill="white" />
      <rect x="47" y="50" width="3" height="3" fill="white" />

      {/* Building top/roof line */}
      <rect
        x="33"
        y="35"
        width="24"
        height="3"
        fill="currentColor"
      />

      {/* Stars above building */}
      <g transform="translate(39, 23)">
        <path
          d="M3 0L3.5 1.5L5 2L3.5 2.5L3 4L2.5 2.5L1 2L2.5 1.5Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(45, 23)">
        <path
          d="M3 0L3.5 1.5L5 2L3.5 2.5L3 4L2.5 2.5L1 2L2.5 1.5Z"
          fill="currentColor"
        />
      </g>
      <g transform="translate(51, 23)">
        <path
          d="M3 0L3.5 1.5L5 2L3.5 2.5L3 4L2.5 2.5L1 2L2.5 1.5Z"
          fill="currentColor"
        />
      </g>

      {/* Magnifying glass handle */}
      <line
        x1="67"
        y1="67"
        x2="88"
        y2="88"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  )
}
