'use client'

import { useState, useTransition } from 'react'
import { addTouchpoint } from '@/lib/actions'
import { timeAgo } from '@/lib/utils'
import type { Touchpoint } from '@/lib/types'

interface Props {
  leadId: string
  touchpoints: (Touchpoint & { author?: { full_name: string } | null })[]
}

export default function TouchpointLog({ leadId, touchpoints }: Props) {
  const [note, setNote] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setError('')
    startTransition(async () => {
      try {
        await addTouchpoint(leadId, note.trim(), nextAction.trim())
        setNote('')
        setNextAction('')
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong.')
      }
    })
  }

  return (
    <div className="bg-white border border-sand/40 rounded-2xl p-6">
      <p className="text-xs font-semibold text-ink/40 uppercase tracking-widest mb-4">
        Call log
      </p>

      {/* Add note */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="What was said, what you learned, where it stands..."
          className="w-full border border-sand rounded-xl px-4 py-3 text-sm bg-cream text-ink focus:outline-none focus:border-rust resize-none transition-colors"
          disabled={isPending}
        />
        <input
          type="text"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          placeholder="Next action (optional)"
          className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm bg-cream text-ink focus:outline-none focus:border-rust mt-2 transition-colors"
          disabled={isPending}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <button
          type="submit"
          disabled={isPending || !note.trim()}
          className="mt-3 bg-ink text-cream text-sm font-medium px-4 py-2 rounded-lg hover:bg-rust hover:text-white disabled:opacity-40 transition-colors"
        >
          {isPending ? 'Logging...' : 'Log this'}
        </button>
      </form>

      {/* Touchpoints list */}
      {touchpoints.length === 0 ? (
        <p className="text-sm text-ink/30 text-center py-4">
          No notes yet. Add the first one.
        </p>
      ) : (
        <div className="space-y-4">
          {touchpoints.map((tp) => (
            <div key={tp.id} className="border-l-2 border-sand pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-ink/60">
                  {tp.author?.full_name ?? 'Team'}
                </span>
                <span className="text-xs text-ink/30">{timeAgo(tp.created_at)}</span>
              </div>
              <p className="text-sm text-ink leading-relaxed">{tp.note}</p>
              {tp.next_action && (
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-xs text-rust font-medium mt-0.5 shrink-0">
                    Next:
                  </span>
                  <p className="text-xs text-ink/60">{tp.next_action}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
