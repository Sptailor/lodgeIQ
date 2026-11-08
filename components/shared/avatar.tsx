/** Initials on a colour. Used for people and teams. */
export function Avatar({ initials, color, size = 32, dark = false }: { initials: string; color: string; size?: number; dark?: boolean }) {
  return (
    <span
      className="caption-3 inline-flex flex-none items-center justify-center rounded-full"
      aria-hidden="true"
      style={{ width: size, height: size, background: color, color: dark ? '#FFFFFF' : '#05080A' }}
    >
      {initials}
    </span>
  )
}
