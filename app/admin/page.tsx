import { createClient } from '@/lib/supabase/server'
import { STATUS_PIPELINE, type LeadStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: leads } = await supabase
    .from('leads')
    .select('status, trip_id, trips(name)')

  const total = leads?.length ?? 0

  const byStatus = (leads ?? []).reduce<Record<string, number>>(
    (acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1
      return acc
    },
    {}
  )

  const byTrip = (leads ?? []).reduce<Record<string, { name: string; count: number }>>(
    (acc, l: any) => {
      if (!l.trip_id) return acc
      const name = l.trips?.name ?? 'Unknown trip'
      if (!acc[l.trip_id]) acc[l.trip_id] = { name, count: 0 }
      acc[l.trip_id].count++
      return acc
    },
    {}
  )

  const tripRows = Object.values(byTrip).sort((a, b) => b.count - a.count)

  return (
    <div>
      <h1
        className="text-2xl font-bold text-ink mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Morning overview
      </h1>
      <p className="text-ink/40 text-sm mb-6">
        {new Date().getHours() < 12
          ? 'Coffee first. Then leads.'
          : new Date().getHours() < 17
            ? 'Afternoon. These leads are not going to call themselves.'
            : 'Still here? The leads will be there tomorrow too.'}
      </p>

      {/* Total */}
      <div className="bg-ink text-cream rounded-2xl px-8 py-7 mb-6 inline-block min-w-[160px]">
        <p className="text-sm opacity-60 mb-1">Total leads</p>
        <p className="text-5xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {total}
        </p>
      </div>

      {/* Pipeline breakdown */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-ink/40 mb-3 mt-8">
        By stage
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {[...STATUS_PIPELINE, 'not_a_fit' as LeadStatus].map((status) => {
          const count = byStatus[status] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div
              key={status}
              className="bg-white border border-sand/40 rounded-xl p-4"
            >
              <p className="text-2xl font-bold text-ink">{count}</p>
              <p className="text-xs text-ink/50 mt-1 capitalize">
                {STATUS_LABELS[status]}
              </p>
              <div className="mt-3 h-1 bg-sand/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rust rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Leads per trip */}
      {tripRows.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ink/40 mb-3">
            By trip
          </h2>
          <div className="bg-white border border-sand/40 rounded-2xl overflow-hidden max-w-lg">
            {tripRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-4 border-b border-sand/20 last:border-0"
              >
                <p className="text-sm text-ink font-medium">{row.name}</p>
                <span className="text-sm font-bold text-rust">{row.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
