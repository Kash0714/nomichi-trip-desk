import { createClient } from '@/lib/supabase/server'
import type { Trip } from '@/lib/types'
import TripCard from '@/components/public/TripCard'
import EnquiryModal from '@/components/public/EnquiryModal'

export default async function PublicPage() {
  const supabase = createClient()
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('status', 'open')
    .order('start_date', { ascending: true })

  const openTrips: Trip[] = trips ?? []

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Nav */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-cream" style={{ fontFamily: 'var(--font-display)' }}>
                NOMICHI
              </h1>
              <p className="text-[10px] text-cream/30 tracking-widest uppercase mt-0.5">
                Wander · Connect · Belong
              </p>
            </div>
            <a
              href="/login"
              className="text-xs text-cream/30 hover:text-cream/60 transition-colors"
            >
              Team login
            </a>
          </div>

          {/* Hero text */}
          <div className="py-16 md:py-24 max-w-3xl">
            <div className="inline-block bg-rust px-3 py-1 rounded-full text-xs font-semibold text-white mb-6 tracking-wide">
              {openTrips.length} trips open now
            </div>
            <h2
              className="text-5xl md:text-7xl font-black text-cream leading-none mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TRAVEL
              <br />
              <span className="text-rust">THAT FINDS</span>
              <br />
              YOU.
            </h2>
            <p className="text-cream/50 text-lg md:text-xl leading-relaxed max-w-xl">
              Slow, offbeat, small-group journeys. Every trip is curated and run
              end to end by our team. No itinerary that cannot bend.
            </p>
          </div>
          <p className="text-cream/30 text-xs mb-6 italic">
            No itinerary that cannot bend. No group that does not fit in a van.
          </p>

          {/* Stats bar */}
          <div className="border-t border-white/10 py-6 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { num: 'Small', sub: 'groups only' },
              { num: 'Curated', sub: 'end to end' },
              { num: 'Offbeat', sub: 'destinations' },
            ].map((s) => (
              <div key={s.num}>
                <p className="text-cream font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>{s.num}</p>
                <p className="text-cream/30 text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yellow accent line */}
      <div className="h-1.5 bg-yellow w-full" />

      {/* Trips section */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-rust uppercase tracking-widest mb-2">Open now</p>
            <h2
              className="text-3xl md:text-4xl font-black text-ink"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Where do you want to go?
            </h2>
          </div>
          <p className="hidden md:block text-sm text-ink/40 max-w-xs text-right">
            Pick a trip and send an enquiry. Someone from the team will be in touch within 48 hours.
          </p>
        </div>

        {openTrips.length === 0 ? (
          <div className="py-24 text-center border border-sand/40 rounded-2xl">
            <p className="text-ink/40 text-lg mb-2">No trips open right now.</p>
            <p className="text-ink/30 text-sm">
              Write to us at{' '}
              <a href="mailto:hello@thenomichi.com" className="underline hover:text-rust">
                hello@thenomichi.com
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} trips={openTrips} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3
              className="text-2xl md:text-3xl font-black mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Not sure which trip?
            </h3>
            <p className="text-cream/50 text-sm">
              We have taken solo travellers, quiet couples, and one very lost engineer to places they did not know they needed.
            </p>
          </div>
          <a
            href="mailto:hello@thenomichi.com"
            className="bg-rust text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-rust-700 transition-colors whitespace-nowrap"
          >
            hello@thenomichi.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ink border-t border-white/5 px-6 md:px-12 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-cream/20">
            Nomichi Explorers Private Limited · thenomichi.com
          </p>
          <p className="text-xs text-cream/20">@thenomichi</p>
        </div>
      </footer>

      <EnquiryModal trips={openTrips} />
    </div>
  )
}