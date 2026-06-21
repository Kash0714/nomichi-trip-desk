'use client'

import { formatDateRange, formatPrice } from '@/lib/utils'
import type { Trip } from '@/lib/types'

interface Props {
  trip: Trip
  trips: Trip[]
  index: number
}

const ACCENT_COLORS = [
  { bg: 'bg-rust', text: 'text-white' },
  { bg: 'bg-olive', text: 'text-cream' },
  { bg: 'bg-ink', text: 'text-cream' },
]

export default function TripCard({ trip, index }: Props) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]

  function openEnquiry() {
    window.dispatchEvent(
      new CustomEvent('nomichi:open-enquiry', { detail: { tripId: trip.id } })
    )
  }

  return (
    <div className="group flex flex-col bg-white border border-sand/40 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Colored header block */}
      <div className={`${accent.bg} px-6 pt-7 pb-6`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-3 opacity-60 ${accent.text}`}>
          {trip.destination}
        </p>
        <h3
          className={`text-2xl font-black leading-tight mb-2 ${accent.text}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {trip.name}
        </h3>
        <p className={`text-sm opacity-60 ${accent.text}`}>
          {formatDateRange(trip.start_date, trip.end_date)}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-6 py-5">
        <p className="text-sm text-ink/70 leading-relaxed flex-1">
          {trip.description}
        </p>

        <div className="mt-6 pt-5 border-t border-sand/30 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-ink/40 mb-0.5">From</p>
            <p className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {formatPrice(trip.price_inr)}
            </p>
            <p className="text-xs text-ink/30">incl. GST · {trip.total_seats} seats</p>
          </div>
          <button
            onClick={openEnquiry}
            className="bg-rust text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-rust-700 active:scale-95 transition-all whitespace-nowrap"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  )
}