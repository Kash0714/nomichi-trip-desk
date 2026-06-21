'use client'

import { useState } from 'react'
import type { Lead, Trip, VibeFit } from '@/lib/types'

interface Props {
  leadId: string
  lead: Lead
  trip: Trip | null
  existingFit: VibeFit | null
  existingReason: string | null
}

const FIT_CONFIG: Record<VibeFit, { label: string; bg: string; dot: string }> = {
  likely: {
    label: 'Likely a fit',
    bg: 'bg-green-50 border-green-200',
    dot: 'bg-green-400',
  },
  maybe: {
    label: 'Maybe',
    bg: 'bg-yellow-50 border-yellow-200',
    dot: 'bg-yellow-400',
  },
  unclear: {
    label: 'Unclear',
    bg: 'bg-gray-50 border-gray-200',
    dot: 'bg-gray-400',
  },
}

export default function VibeCheck({
  leadId,
  existingFit: initialFit,
  existingReason: initialReason,
}: Props) {
  const [fit, setFit] = useState<VibeFit | null>(initialFit)
  const [reason, setReason] = useState<string | null>(initialReason)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function runVibeCheck() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/vibe-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not get a read. Try again.')
        return
      }
      setFit(data.fit)
      setReason(data.reason)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const config = fit ? FIT_CONFIG[fit] : null

  return (
    <div className="bg-white border border-sand/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest">
          AI vibe read
        </p>
        <span className="text-xs text-ink/30">suggestion only</span>
      </div>

      {config && fit ? (
        <div className={`border rounded-xl p-4 ${config.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className="text-sm font-semibold text-ink">{config.label}</span>
          </div>
          <p className="text-sm text-ink/70 leading-relaxed">{reason}</p>
          <button
            onClick={runVibeCheck}
            disabled={loading}
            className="mt-3 text-xs text-ink/30 hover:text-ink/60 transition-colors underline"
          >
            {loading ? 'Running...' : 'Re-read'}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-ink/50 mb-4 leading-relaxed">
            Get an AI read on whether this traveller fits Nomichi's style. Takes a second.
          </p>
          <button
            onClick={runVibeCheck}
            disabled={loading}
            className="w-full bg-ink text-cream text-sm font-medium py-2.5 rounded-lg hover:bg-rust transition-colors disabled:opacity-50"
          >
            {loading ? 'Reading the vibe...' : 'Get AI read'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
