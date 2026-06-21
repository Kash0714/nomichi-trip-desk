import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDateRange, formatPrice } from '@/lib/utils'
import { deleteTrip } from '@/lib/actions'

export default async function TripsPage() {
  const supabase = createClient()
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Trips
        </h1>
        <Link
          href="/admin/trips/new"
          className="bg-rust text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-rust-700 transition-colors"
        >
          New trip
        </Link>
      </div>

      <div className="bg-white border border-sand/40 rounded-2xl overflow-hidden">
        {!trips || trips.length === 0 ? (
          <div className="py-16 text-center text-ink/40 text-sm">
            No trips yet.{' '}
            <Link href="/admin/trips/new" className="text-rust underline">
              Create one.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand/30 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">
                  Trip
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden md:table-cell">
                  Dates
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden lg:table-cell">
                  Price
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden md:table-cell">
                  Seats
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-sand/20 last:border-0 hover:bg-sand-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{trip.name}</p>
                    <p className="text-xs text-ink/40 mt-0.5">{trip.destination}</p>
                  </td>
                  <td className="px-5 py-4 text-ink/60 hidden md:table-cell">
                    {formatDateRange(trip.start_date, trip.end_date)}
                  </td>
                  <td className="px-5 py-4 text-ink/60 hidden lg:table-cell">
                    {formatPrice(trip.price_inr)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${trip.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink/60 hidden md:table-cell">
                    {trip.total_seats}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/trips/${trip.id}/edit`}
                        className="text-rust text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await deleteTrip(trip.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="text-ink/30 text-xs hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
