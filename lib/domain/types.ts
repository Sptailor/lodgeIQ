/** Result of one check: p = pass, n = needs work, f = fail. */
export type Res = 'p' | 'n' | 'f'

export type CategoryScores = [number, number, number]

export type InspectionSummary = {
  id: string
  date: string // ISO
  inspector: string
  score: number
  cats: CategoryScores
  res: string // 9 characters, one per check, in checklist order
}

export type Property = {
  id: string
  name: string
  place: string
  city: string
  country: string
  countryCode: string
  region: string
  lat: number
  lon: number
  photo: string | null
  kind: string
  size: string
  visitStandardDays: number
  inspections: InspectionSummary[] // ascending by date
}

export type FollowUpStatus = 'open' | 'progress' | 'done'

export type FollowUp = {
  id: string
  propertyId: string
  checkIndex: number
  text: string
  photo: string | null
  status: FollowUpStatus
  owner: string | null
  due: string // ISO
  note: string | null
  isNew?: boolean
}

export type Visit = {
  id: string
  propertyId: string
  inspectorId: string
  date: string // ISO
  planned?: boolean
}

export type Note = {
  id: string
  initials: string
  actor: string
  text: string
  propertyId: string | null
  color: string
  at: string // ISO
  unread: boolean
}

export type Person = {
  id: string
  name: string
  initials: string
  region: string
  color: string
}

export type Check = {
  id: string
  slug: string
  category: 0 | 1 | 2
  name: string
  weight: number
  help: string
  evidence: string | null
  alt: string
}

export type PortfolioSnapshot = {
  takenAt: string
  weekStart: string // ISO, Monday 00:00 UTC of the planning week
  user: {
    id: string
    name: string
    firstName: string
    initials: string
    role: string
    isDemo: boolean
  }
  checks: Check[]
  properties: Property[]
  followUps: FollowUp[]
  visits: Visit[]
  notes: Note[]
  people: Person[]
}
