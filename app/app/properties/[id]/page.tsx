import { PropertyView } from '@/components/property/property-view'

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyView id={params.id} />
}
