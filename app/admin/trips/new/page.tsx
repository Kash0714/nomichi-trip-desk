import Link from 'next/link'
import TripForm from '@/components/admin/TripForm'
import { createTrip } from '@/lib/actions'

export default function NewTripPage() {
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
        New trip
      </h1>
      <TripForm action={createTrip} />
    </div>
  )
}
