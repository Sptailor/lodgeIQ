import { PortfolioView } from '@/components/portfolio/portfolio-view'

export default function PortfolioPage({ searchParams }: { searchParams: { country?: string; property?: string } }) {
  return <PortfolioView initial={{ country: searchParams.country, property: searchParams.property }} />
}
