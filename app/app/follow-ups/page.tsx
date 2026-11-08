import { FollowUpsView } from '@/components/follow-ups/follow-ups-view'

export default function FollowUpsPage({ searchParams }: { searchParams: { property?: string } }) {
  return <FollowUpsView initialProperty={searchParams.property} />
}
