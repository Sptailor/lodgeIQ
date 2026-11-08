import { ReportsView } from '@/components/reports/reports-view'

export default function ReportsPage({ searchParams }: { searchParams: { country?: string } }) {
  return <ReportsView initialCountry={searchParams.country} />
}
