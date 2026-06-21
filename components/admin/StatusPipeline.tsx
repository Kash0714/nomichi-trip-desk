'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus } from '@/lib/actions'
import { STATUS_PIPELINE, STATUS_LABELS, type LeadStatus } from '@/lib/types'

interface Props {
  leadId: string
  currentStatus: LeadStatus
}

export default function StatusPipeline({ leadId, currentStatus }: Props) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  function move(next: LeadStatus) {
    if (next === status) return
    setStatus(next)
    startTransition(() => updateLeadStatus(leadId, next))
  }

  const isNotAFit = status === 'not_a_fit'

  return (
    <div className="bg-white border border-sand/40 rounded-2xl p-5">
      <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-4">
        Pipeline
      </p>

      {/* Main stages */}
      <div className="space-y-2">
        {STATUS_PIPELINE.map((s, i) => {
          const isActive = s === status
          const isPast =
            !isNotAFit &&
            STATUS_PIPELINE.indexOf(s) < STATUS_PIPELINE.indexOf(status as any)

          return (
            <button
              key={s}
              onClick={() => move(s)}
              disabled={isPending}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2.5 ${
                isActive
                  ? 'bg-rust text-white font-semibold'
                  : isPast
                  ? 'bg-sand/30 text-ink/50'
                  : 'text-ink/50 hover:bg-sand/20 hover:text-ink'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs ${
                  isActive
                    ? 'border-white bg-white/20'
                    : isPast
                    ? 'border-sand bg-sand/50'
                    : 'border-sand/50'
                }`}
              >
                {isPast && '✓'}
              </span>
              {STATUS_LABELS[s]}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-sand/30" />

      {/* Not a fit */}
      <button
        onClick={() => move('not_a_fit')}
        disabled={isPending}
        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isNotAFit
            ? 'bg-gray-100 text-gray-600 font-semibold'
            : 'text-ink/30 hover:text-ink/60 hover:bg-gray-50'
        }`}
      >
        Not a fit
      </button>

      {isPending && (
        <p className="text-xs text-ink/30 mt-2 text-center">Saving...</p>
      )}
    </div>
  )
}
