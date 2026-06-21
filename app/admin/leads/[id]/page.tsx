import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatDateRange, formatPrice } from '@/lib/utils'
import { GROUP_TYPE_LABELS } from '@/lib/types'
import StatusPipeline from '@/components/admin/StatusPipeline'
import TouchpointLog from '@/components/admin/TouchpointLog'
import OwnerSelect from '@/components/admin/OwnerSelect'
import VibeCheck from '@/components/admin/VibeCheck'

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: lead } = await supabase
    .from('leads')
    .select('*, trip:trips(*), owner:profiles!leads_owner_id_fkey(full_name, id)')
    .eq('id', params.id)
    .single()

  if (!lead) notFound()

  const { data: touchpoints } = await supabase
    .from('touchpoints')
    .select('*, author:profiles(full_name)')
    .eq('lead_id', params.id)
    .order('created_at', { ascending: false })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name')

  const trip = (lead as any).trip
  const owner = (lead as any).owner

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-ink/40 hover:text-rust mb-6 transition-colors"
      >
        ← Leads
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 space-y-5">
          {/* Lead info card */}
          <div className="bg-white border border-sand/40 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1
                  className="text-2xl font-bold text-ink"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {lead.name}
                </h1>
                <p className="text-ink/50 text-sm mt-0.5">
                  Enquiry received {formatDate(lead.created_at)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">Phone</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-ink font-medium hover:text-rust transition-colors"
                >
                  {lead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-ink font-medium hover:text-rust transition-colors break-all"
                >
                  {lead.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">Travelling as</p>
                <p className="text-ink font-medium">
                  {GROUP_TYPE_LABELS[lead.group_type as keyof typeof GROUP_TYPE_LABELS]}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">Preferred month</p>
                <p className="text-ink font-medium">{lead.preferred_month}</p>
              </div>
            </div>

            {lead.vibe_text && (
              <div className="mt-5 border-t border-sand/30 pt-5">
                <p className="text-xs text-ink/40 uppercase tracking-wide mb-2">
                  What they are hoping this trip feels like
                </p>
                <p className="text-ink/80 text-sm leading-relaxed italic">
                  &ldquo;{lead.vibe_text}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Trip card */}
          {trip && (
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
              <p className="text-xs text-ink/40 uppercase tracking-wide mb-3">Interested in</p>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-ink">{trip.name}</p>
                  <p className="text-ink/50 text-sm mt-0.5">{trip.destination}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    trip.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {trip.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-ink/50">
                <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                <span>·</span>
                <span>{formatPrice(trip.price_inr)} incl. GST</span>
                <span>·</span>
                <span>{trip.total_seats} seats</span>
              </div>
            </div>
          )}

          {/* Call log */}
          <TouchpointLog
            leadId={params.id}
            touchpoints={touchpoints ?? []}
          />
        </div>

        {/* Right column */}
        <div className="lg:w-72 space-y-5">
          {/* Pipeline */}
          <StatusPipeline leadId={params.id} currentStatus={lead.status as any} />

          {/* Owner */}
          <OwnerSelect
            leadId={params.id}
            profiles={profiles ?? []}
            currentOwnerId={owner?.id ?? null}
          />

          {/* Vibe check */}
          <VibeCheck
            leadId={params.id}
            lead={lead as any}
            trip={trip}
            existingFit={lead.ai_vibe_fit as any}
            existingReason={lead.ai_vibe_reason}
          />
        </div>
      </div>
    </div>
  )
}
