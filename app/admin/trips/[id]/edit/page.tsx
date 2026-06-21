import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TripForm from '@/components/admin/TripForm'
import { updateTrip } from '@/lib/actions'

export default async function EditTripPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!trip) notFound()

  const action = updateTrip.bind(null, params.id)

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/trips"
        className="inline-flex items-center gap-1.5 text-sm text-ink/40 hover:text-rust mb-6 transition-colors"
      >
        ← Trips
      </Link>
      <h1
        className="text-2xl font-bold text-ink mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Edit trip
      </h1>
      <TripForm action={action} defaultValues={trip} />
    </div>
  )
}
