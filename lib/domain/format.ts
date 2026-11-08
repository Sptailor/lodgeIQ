/**
 * Date and text formatting. Everything uses UTC so the server and the browser
 * always produce the same text (no hydration mismatches).
 */

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DAY_MS = 86400000

export const toDate = (d: Date | string): Date => (typeof d === 'string' ? new Date(d) : d)

export const monthShort = (monthIndex: number): string => MON[((monthIndex % 12) + 12) % 12]

/** "7 Nov" */
export function shortDate(d: Date | string): string {
  const t = toDate(d)
  return `${t.getUTCDate()} ${MON[t.getUTCMonth()]}`
}

/** "Mon 9" */
export function weekdayDay(d: Date | string): string {
  const t = toDate(d)
  return `${DOW[t.getUTCDay()]} ${t.getUTCDate()}`
}

/** "Mon 9 Nov" */
export function weekdayDayMonth(d: Date | string): string {
  const t = toDate(d)
  return `${DOW[t.getUTCDay()]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]}`
}

/** "Saturday 7 November" */
export function longDate(d: Date | string): string {
  const t = toDate(d)
  return `${DOW_LONG[t.getUTCDay()]} ${t.getUTCDate()} ${MON_LONG[t.getUTCMonth()]}`
}

/** "9 November" */
export function dayMonthLong(d: Date | string): string {
  const t = toDate(d)
  return `${t.getUTCDate()} ${MON_LONG[t.getUTCMonth()]}`
}

export const startOfUtcDay = (d: Date): Date =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))

export const addDays = (d: Date, n: number): Date => new Date(d.getTime() + n * DAY_MS)

export const sameUtcDay = (a: Date | string, b: Date | string): boolean =>
  startOfUtcDay(toDate(a)).getTime() === startOfUtcDay(toDate(b)).getTime()

/**
 * Monday 00:00 UTC of the planning week. On Saturday and Sunday the planning
 * week is the one that starts next Monday.
 */
export function planningWeekStart(now: Date): Date {
  const day = now.getUTCDay() // 0 Sunday ... 6 Saturday
  const diff = day === 6 ? 2 : day === 0 ? 1 : 1 - day
  return addDays(startOfUtcDay(now), diff)
}

/** "Just now", "12 min ago", "3 hr ago", then a short date. */
export function relativeTime(iso: string, now: Date): string {
  const mins = Math.floor((now.getTime() - new Date(iso).getTime()) / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return shortDate(iso)
}

export const greetingWord = (hour: number): 'morning' | 'afternoon' | 'evening' =>
  hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

export const countWord = (n: number): string => ['One', 'Two', 'Three', 'Four', 'Five'][n - 1] ?? String(n)

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
