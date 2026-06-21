import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { STATUS_LABELS, type LeadStatus } from '@/lib/types'
import { STATUS_COLORS, timeAgo } from '@/lib/utils'
import LeadFilters from '@/components/admin/LeadFilters'

interface SearchParams {
  q?: string
  status?: string
  trip?: string
  owner?: string
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createClient()

  // Build query with filters
  let query = supabase
    .from('leads')
    .select('*, trip:trips(name), owner:profiles(full_name)')
    .order('created_at', { ascending: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.trip) query = query.eq('trip_id', searchParams.trip)
  if (searchParams.owner) query = query.eq('owner_id', searchParams.owner)
  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,phone.ilike.%${searchParams.q}%`
    )
  }

  const { data: leads } = await query

  // For filters
  const { data: trips } = await supabase
    .from('trips')
    .select('id, name')
    .order('name')

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Leads
        </h1>
        <span className="text-sm text-ink/40">{leads?.length ?? 0} shown</span>
      </div>

      <LeadFilters
        trips={trips ?? []}
        profiles={profiles ?? []}
        current={searchParams}
      />

      {/* Table */}
      <div className="bg-white border border-sand/40 rounded-2xl overflow-hidden mt-5">
        {!leads || leads.length === 0 ? (
          <div className="py-16 text-center text-ink/40 text-sm">
            No leads match these filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand/30 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden md:table-cell">
                  Trip
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden lg:table-cell">
                  Owner
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-ink/40 uppercase tracking-wide hidden lg:table-cell">
                  Received
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr
                  key={lead.id}
                  className="border-b border-sand/20 last:border-0 hover:bg-sand-50/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="block group"
                    >
                      <p className="font-medium text-ink group-hover:text-rust transition-colors">
                        {lead.name}
                      </p>
                      <p className="text-xs text-ink/40 mt-0.5">{lead.phone}</p>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink/60 hidden md:table-cell">
                    {(lead.trip as any)?.name ?? (
                      <span className="text-ink/30">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[lead.status as LeadStatus]
                      }`}
                    >
                      {STATUS_LABELS[lead.status as LeadStatus]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink/50 hidden lg:table-cell">
                    {(lead.owner as any)?.full_name ?? (
                      <span className="text-ink/30">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink/40 hidden lg:table-cell">
                    {timeAgo(lead.created_at)}
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
