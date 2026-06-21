'use client'

import { useState, useTransition } from 'react'
import { assignLeadOwner } from '@/lib/actions'
import type { Profile } from '@/lib/types'

interface Props {
  leadId: string
  profiles: Profile[]
  currentOwnerId: string | null
}

export default function OwnerSelect({ leadId, profiles, currentOwnerId }: Props) {
  const [ownerId, setOwnerId] = useState(currentOwnerId ?? '')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setOwnerId(val)
    startTransition(() => assignLeadOwner(leadId, val || null))
  }

  return (
    <div className="bg-white border border-sand/40 rounded-2xl p-5">
      <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">
        Owner
      </p>
      <select
        value={ownerId}
        onChange={handleChange}
        disabled={isPending}
        className="w-full border border-sand rounded-lg px-3 py-2.5 text-sm text-ink bg-cream focus:outline-none focus:border-rust transition-colors"
      >
        <option value="">Unassigned</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>
      {isPending && (
        <p className="text-xs text-ink/30 mt-1.5">Saving...</p>
      )}
    </div>
  )
}
