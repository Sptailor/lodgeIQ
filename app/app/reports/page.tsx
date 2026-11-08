import { ReportsView } from '@/components/reports/reports-view'

export default function ReportsPage({ searchParams }: { searchParams: { region?: string; country?: string } }) {
  return <ReportsView initialRegion={searchParams.region} initialCountry={searchParams.country} />
}
