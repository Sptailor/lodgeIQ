/**
 * The sample portfolio. Single source for the database seed, the nightly reseed
 * and the landing page, so the website and the app always agree.
 * Everything here is invented sample data.
 */

import { CHECKS, type CheckDef } from './checks'

export const HOME = { code: 'KEN', city: 'Nairobi', lat: -1.29, lon: 36.82 } as const

export const COUNTRY_NAMES: Record<string, string> = {
  KEN: 'Kenya',
  TZA: 'Tanzania',
  SGP: 'Singapore',
  JPN: 'Japan',
  AUS: 'Australia',
  UAE: 'United Arab Emirates',
  FRA: 'France',
  GBR: 'United Kingdom',
  ESP: 'Spain',
  CHE: 'Switzerland',
  USA: 'United States',
}

export const REGION_BY_COUNTRY: Record<string, string> = {
  KEN: 'Kenya',
  TZA: 'Tanzania',
  FRA: 'Europe',
  GBR: 'Europe',
  ESP: 'Europe',
  CHE: 'Europe',
  SGP: 'Asia Pacific',
  JPN: 'Asia Pacific',
  AUS: 'Asia Pacific',
  USA: 'Americas',
  UAE: 'Middle East',
}

export type SampleProperty = {
  id: string
  name: string
  place: string
  city: string
  country: string
  countryCode: string
  region: string
  lat: number
  lon: number
  latestResults: string // 9 characters
  photo: string | null
  kind: string
  size: string
  daysSinceLatest: number
  latestInspector: string
  history: number[] | null // scores of the four earlier inspections, oldest first
}

type Row = [string, string, string, string, number, number, string, string | null, string, string, number, string]

const rows: Row[] = [
  ['acacia-ridge-camp', 'Acacia Ridge Camp', 'Maasai Mara, Kenya', 'KEN', -1.45, 35.05, 'ppnppppnp', '/images/tented-camp.jpg', 'Tented camp', '12 tents', 23, 'John Davis'],
  ['kilima-view-lodge', 'Kilima View Lodge', 'Amboseli, Kenya', 'KEN', -2.64, 37.25, 'pnnpppnnp', '/images/savanna-sunset.jpg', 'Safari lodge', '24 rooms', 41, 'Amina Otieno'],
  ['flamingo-shore-lodge', 'Flamingo Shore Lodge', 'Lake Naivasha, Kenya', 'KEN', -0.77, 36.38, 'nnnppnnpp', null, 'Lakeside lodge', '30 rooms', 58, 'Amina Otieno'],
  ['ewaso-river-camp', 'Ewaso River Camp', 'Samburu, Kenya', 'KEN', 0.6, 37.55, 'npnfnfnpn', '/images/lodge-blue-hour.jpg', 'Tented camp', '18 tents', 26, 'John Davis'],
  ['coral-tide-resort', 'Coral Tide Resort', 'Diani Beach, Kenya', 'KEN', -4.3, 39.58, 'pppnppnnp', '/images/beach-pool-villas.jpg', 'Beach resort', '64 rooms', 4, 'Amina Otieno'],
  ['dhow-house', 'Dhow House', 'Lamu, Kenya', 'KEN', -2.27, 40.9, 'nnnpnnnnp', null, 'Boutique hotel', '9 rooms', 37, 'John Davis'],
  ['red-earth-camp', 'Red Earth Camp', 'Tsavo East, Kenya', 'KEN', -2.95, 38.6, 'nnnnnnnpn', '/images/tent-interior.jpg', 'Tented camp', '14 tents', 102, 'John Davis'],
  ['karen-garden-hotel', 'Karen Garden Hotel', 'Nairobi, Kenya', 'KEN', -1.33, 36.71, 'pnnpnpnpp', null, 'City hotel', '48 rooms', 19, 'Amina Otieno'],
  ['seronera-plains-camp', 'Seronera Plains Camp', 'Serengeti, Tanzania', 'TZA', -2.45, 34.83, 'pnpppnppp', '/images/safari-vehicle.jpg', 'Mobile camp', '10 tents', 33, 'Amina Otieno'],
  ['stone-town-inn', 'Stone Town Inn', 'Zanzibar, Tanzania', 'TZA', -6.16, 39.19, 'nnnnppnnn', '/images/stone-room.jpg', 'Heritage hotel', '22 rooms', 47, 'John Davis'],
  ['singapore-sky-tower', 'Singapore Sky Tower', 'Singapore', 'SGP', 1.35, 103.8, 'pppppppnp', '/images/rooftop-pool.jpg', 'City hotel', '310 rooms', 1, 'Mei Tan'],
  ['tokyo-imperial-suites', 'Tokyo Imperial Suites', 'Tokyo, Japan', 'JPN', 35.7, 139.7, 'pnnffpnpn', '/images/shoji-room.jpg', 'City hotel', '220 rooms', 5, 'Mei Tan'],
  ['sydney-harbor-hotel', 'Sydney Harbor Hotel', 'Sydney, Australia', 'AUS', -33.9, 151.2, 'pnnpnnnnp', null, 'City hotel', '180 rooms', 97, 'Mei Tan'],
  ['dubai-marina-resort', 'Dubai Marina Resort', 'Dubai, UAE', 'UAE', 25.1, 55.1, 'pnnnpnnpn', '/images/infinity-pool-dusk.jpg', 'Resort', '260 rooms', 64, 'John Davis'],
  ['grand-palace-hotel', 'Grand Palace Hotel', 'Paris, France', 'FRA', 48.9, 2.35, 'nnnpnpnnn', null, 'City hotel', '140 rooms', 51, 'Sarah Wilson'],
  ['london-westminster-inn', 'London Westminster Inn', 'London, UK', 'GBR', 51.5, -0.13, 'pnnpnpfpp', '/images/hotel-lobby.jpg', 'City hotel', '96 rooms', 7, 'Sarah Wilson'],
  ['barcelona-beach-club', 'Barcelona Beach Club', 'Barcelona, Spain', 'ESP', 41.4, 2.17, 'ppnppppnp', null, 'Beach hotel', '120 rooms', 9, 'Sarah Wilson'],
  ['mountain-view-lodge', 'Mountain View Lodge', 'Zurich, Switzerland', 'CHE', 47.4, 8.54, 'pnppnpnpp', '/images/alpine-lake-lodge.jpg', 'Lake lodge', '40 rooms', 44, 'Sarah Wilson'],
  ['new-york-central-plaza', 'New York Central Plaza', 'New York, USA', 'USA', 40.7, -74.0, 'nnnpnnnnn', '/images/hotel-corridor.jpg', 'City hotel', '410 rooms', 11, 'John Davis'],
  ['sunset-beach-resort', 'Sunset Beach Resort', 'Miami, USA', 'USA', 25.8, -80.2, 'ppnpppnpn', null, 'Beach resort', '200 rooms', 4, 'John Davis'],
]

const HISTORY_OVERRIDE: Record<string, number[]> = {
  'ewaso-river-camp': [3.9, 3.7, 3.4, 3.2],
  'tokyo-imperial-suites': [3.6, 3.5, 3.4, 3.3],
  'coral-tide-resort': [3.6, 3.7, 3.8, 3.9],
  'new-york-central-plaza': [3.5, 3.3, 3.2, 3.3],
  'london-westminster-inn': [3.4, 3.5, 3.6, 3.7],
}

export const SAMPLE_PROPERTIES: SampleProperty[] = rows.map((r) => {
  const [id, name, place, countryCode, lat, lon, latestResults, photo, kind, size, daysSinceLatest, latestInspector] = r
  const i = place.lastIndexOf(',')
  const city = i === -1 ? place : place.slice(0, i).trim()
  const country = i === -1 ? place : place.slice(i + 1).trim()
  return {
    id,
    name,
    place,
    city,
    country,
    countryCode,
    region: REGION_BY_COUNTRY[countryCode],
    lat,
    lon,
    latestResults,
    photo,
    kind,
    size,
    daysSinceLatest,
    latestInspector,
    history: HISTORY_OVERRIDE[id] ?? null,
  }
})

export type SamplePerson = {
  name: string
  email: string
  role: 'MANAGER' | 'INSPECTOR'
  region: string
  color: string | null
  initials: string
  isDemo: boolean
  schedulable: boolean
}

export const SAMPLE_PEOPLE: SamplePerson[] = [
  { name: 'Sarah Wilson', email: 'demo@lodgeiq.app', role: 'MANAGER', region: 'Europe', color: '#B8C4FF', initials: 'SW', isDemo: true, schedulable: true },
  { name: 'John Davis', email: 'john.davis@lodgeiq.app', role: 'INSPECTOR', region: 'Kenya', color: '#6FE3C6', initials: 'JD', isDemo: false, schedulable: true },
  { name: 'Amina Otieno', email: 'amina.otieno@lodgeiq.app', role: 'INSPECTOR', region: 'Kenya and Tanzania', color: '#FFC56B', initials: 'AO', isDemo: false, schedulable: true },
  { name: 'Mei Tan', email: 'mei.tan@lodgeiq.app', role: 'INSPECTOR', region: 'Asia Pacific', color: '#FFFFFF', initials: 'MT', isDemo: false, schedulable: true },
  { name: 'David Kim', email: 'david.kim@lodgeiq.app', role: 'MANAGER', region: 'Operations', color: null, initials: 'DK', isDemo: false, schedulable: false },
]

/** Row order in the schedule. */
export const SCHEDULE_PEOPLE = ['John Davis', 'Amina Otieno', 'Mei Tan', 'Sarah Wilson']

/** Colour for people and for the property manager in the activity list. */
export const ACTOR_COLORS: Record<string, string> = {
  JD: '#6FE3C6',
  AO: '#FFC56B',
  MT: '#FFFFFF',
  SW: '#B8C4FF',
  PM: '#B8C4FF',
  DK: '#FFFFFF',
}

export type SampleCheck = CheckDef & { order: number }
export const SAMPLE_CHECKS: SampleCheck[] = CHECKS.map((c, order) => ({ ...c, order }))

export type SampleFollowUp = {
  id: string
  propertyId: string
  checkIndex: number
  text: string
  photo: string | null
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
  owner: string | null
  dueInDays: number
}

export const SAMPLE_FOLLOW_UPS: SampleFollowUp[] = [
  { id: 'fu-ewaso-fire', propertyId: 'ewaso-river-camp', checkIndex: 3, text: 'Extinguisher service tags expired in the mess tent and tents 2 and 3.', photo: '/images/evidence-extinguisher.jpg', status: 'OPEN', owner: null, dueInDays: 2 },
  { id: 'fu-ewaso-map', propertyId: 'ewaso-river-camp', checkIndex: 5, text: 'No evacuation map in the main lodge corridor.', photo: '/images/evidence-corridor.jpg', status: 'IN_PROGRESS', owner: 'Camp manager', dueInDays: 7 },
  { id: 'fu-tokyo-door', propertyId: 'tokyo-imperial-suites', checkIndex: 4, text: 'Connecting door between rooms 1204 and 1205 does not lock.', photo: '/images/evidence-door-lock.jpg', status: 'IN_PROGRESS', owner: 'Front office manager', dueInDays: 5 },
  { id: 'fu-tokyo-fire', propertyId: 'tokyo-imperial-suites', checkIndex: 3, text: 'Two extinguishers on floor 12 are past their service date.', photo: null, status: 'OPEN', owner: null, dueInDays: 3 },
  { id: 'fu-london-wifi', propertyId: 'london-westminster-inn', checkIndex: 6, text: 'Lobby WiFi measured 4 Mbps at check in time.', photo: null, status: 'OPEN', owner: null, dueInDays: 14 },
  { id: 'fu-coral-bathroom', propertyId: 'coral-tide-resort', checkIndex: 0, text: 'Grout and drains deep cleaned in rooms 3 and 7.', photo: '/images/evidence-bathroom.jpg', status: 'DONE', owner: 'Housekeeping lead', dueInDays: -4 },
]

export type SampleVisit = { propertyId: string; inspectorEmail: string; dayOffset: number }

/** Day offset is 0 to 6 from the Monday of the planning week. */
export const SAMPLE_VISITS: SampleVisit[] = [
  { propertyId: 'flamingo-shore-lodge', inspectorEmail: 'john.davis@lodgeiq.app', dayOffset: 0 },
  { propertyId: 'grand-palace-hotel', inspectorEmail: 'demo@lodgeiq.app', dayOffset: 1 },
  { propertyId: 'kilima-view-lodge', inspectorEmail: 'amina.otieno@lodgeiq.app', dayOffset: 1 },
  { propertyId: 'tokyo-imperial-suites', inspectorEmail: 'mei.tan@lodgeiq.app', dayOffset: 2 },
  { propertyId: 'dhow-house', inspectorEmail: 'amina.otieno@lodgeiq.app', dayOffset: 3 },
  { propertyId: 'dubai-marina-resort', inspectorEmail: 'john.davis@lodgeiq.app', dayOffset: 4 },
]

export type SampleActivity = {
  initials: string
  actor: string
  text: string
  propertyId: string
  minutesAgo: number
}

/** The first five seed the database. All seven feed the demo simulation. */
export const SAMPLE_ACTIVITY: SampleActivity[] = [
  { initials: 'JD', actor: 'John Davis', text: 'started an inspection at Kilima View Lodge.', propertyId: 'kilima-view-lodge', minutesAgo: 120 },
  { initials: 'AO', actor: 'Amina Otieno', text: 'added 3 photos at Coral Tide Resort.', propertyId: 'coral-tide-resort', minutesAgo: 60 },
  { initials: 'MT', actor: 'Mei Tan', text: 'submitted Singapore Sky Tower. Score 4.9.', propertyId: 'singapore-sky-tower', minutesAgo: 25 },
  { initials: 'PM', actor: 'Property manager', text: 'at Dhow House replied to a follow up.', propertyId: 'dhow-house', minutesAgo: 12 },
  { initials: 'JD', actor: 'John Davis', text: 'marked WiFi as needs work at Kilima View Lodge.', propertyId: 'kilima-view-lodge', minutesAgo: 4 },
  { initials: 'AO', actor: 'Amina Otieno', text: 'is on the way to Flamingo Shore Lodge.', propertyId: 'flamingo-shore-lodge', minutesAgo: 0 },
  { initials: 'MT', actor: 'Mei Tan', text: 'booked a revisit at Tokyo Imperial Suites this week.', propertyId: 'tokyo-imperial-suites', minutesAgo: 0 },
]

/** People and teams a follow up can be assigned to. */
export const ASSIGN_OWNERS: { name: string; role: string; team?: boolean }[] = [
  { name: 'Property manager', role: 'Contact at the property', team: true },
  { name: 'Maintenance team', role: 'At the property', team: true },
  { name: 'Housekeeping team', role: 'At the property', team: true },
  { name: 'Sarah Wilson', role: 'You, operations' },
  { name: 'John Davis', role: 'Inspector, Kenya' },
  { name: 'Amina Otieno', role: 'Inspector, Kenya and Tanzania' },
  { name: 'Mei Tan', role: 'Inspector, Asia Pacific' },
  { name: 'David Kim', role: 'Operations' },
]

/** The "in the field" avatars shown in the demo header. */
export const DEMO_TEAM = [
  { initials: 'JD', tip: 'John Davis, at Kilima View Lodge', color: '#6FE3C6' },
  { initials: 'AO', tip: 'Amina Otieno, driving to Diani', color: '#FFC56B' },
  { initials: 'MT', tip: 'Mei Tan, in Singapore', color: '#FFFFFF' },
]

/** Answers used by "Fill in sample answers" in the demo. */
export const SAMPLE_ANSWERS: Record<string, string> = { 'ewaso-river-camp': 'pppppnnpp' }
export const DEFAULT_SAMPLE_ANSWERS = 'pppppnppp'
