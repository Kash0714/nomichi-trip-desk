'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  trips: { id: string; name: string }[]
  profiles: { id: string; full_name: string }[]
  current: { q?: string; status?: string; trip?: string; owner?: string }
}

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'vibe_check_sent', label: 'Vibe check sent' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'not_a_fit', label: 'Not a fit' },
]

export default function LeadFilters({ trips, profiles, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const next = { ...current, [key]: value }
      Object.entries(next).forEach(([k, v]) => {
        if (v) params.set(k, v)
      })
      router.push(`${pathname}?${params.toString()}`)
    },
    [current, pathname, router]
  )

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = !!(current.q || current.status || current.trip || current.owner)

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <input
        type="text"
        defaultValue={current.q}
        onChange={(e) => update('q', e.target.value)}
        placeholder="Search name, email, phone..."
        className="border border-sand rounded-lg px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors w-56"
      />

      {/* Status */}
      <select
        value={current.status ?? ''}
        onChange={(e) => update('status', e.target.value)}
        className="border border-sand rounded-lg px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Trip */}
      <select
        value={current.trip ?? ''}
        onChange={(e) => update('trip', e.target.value)}
        className="border border-sand rounded-lg px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
      >
        <option value="">All trips</option>
        {trips.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Owner */}
      <select
        value={current.owner ?? ''}
        onChange={(e) => update('owner', e.target.value)}
        className="border border-sand rounded-lg px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
      >
        <option value="">All owners</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-ink/40 hover:text-rust transition-colors underline"
        >
          Clear
        </button>
      )}
    </div>
  )
}
