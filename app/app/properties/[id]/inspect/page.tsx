import { InspectionOverlay } from '@/components/inspect/inspection-overlay'
import { PropertyView } from '@/components/property/property-view'

// The property page stays visible (blurred) behind the inspection.
export default function InspectPage({ params }: { params: { id: string } }) {
  return (
    <>
      <PropertyView id={params.id} />
      <InspectionOverlay id={params.id} />
    </>
  )
}
