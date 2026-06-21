'use client'

import { useRef, useState } from 'react'
import type { Trip } from '@/lib/types'

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<Trip>
}

export default function TripForm({ action, defaultValues }: Props) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setError('')
    setPending(true)
    try {
      await action(new FormData(formRef.current))
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
      setPending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <Field label="Trip name">
        <input
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          placeholder="Spiti in Winter"
          className={inputCls}
        />
      </Field>

      <Field label="Destination">
        <input
          name="destination"
          type="text"
          required
          defaultValue={defaultValues?.destination}
          placeholder="Spiti Valley, Himachal Pradesh"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <input
            name="start_date"
            type="date"
            required
            defaultValue={defaultValues?.start_date}
            className={inputCls}
          />
        </Field>
        <Field label="End date">
          <input
            name="end_date"
            type="date"
            required
            defaultValue={defaultValues?.end_date}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price incl. GST (INR)">
          <input
            name="price_inr"
            type="number"
            required
            min={0}
            defaultValue={defaultValues?.price_inr}
            placeholder="28500"
            className={inputCls}
          />
        </Field>
        <Field label="Total seats">
          <input
            name="total_seats"
            type="number"
            required
            min={1}
            max={50}
            defaultValue={defaultValues?.total_seats ?? 12}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Status">
        <select
          name="status"
          defaultValue={defaultValues?.status ?? 'open'}
          className={inputCls}
        >
          <option value="open">Open — visible on public page</option>
          <option value="closed">Closed — hidden from public</option>
        </select>
      </Field>

      <Field label="Short description">
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          placeholder="One or two sentences about what this trip feels like. Write in Nomichi's voice: warm, specific, no jargon."
          className={inputCls + ' resize-none'}
        />
        <p className="mt-1 text-xs text-ink/40">
          This appears on the public enquiry page. Keep it under 200 characters.
        </p>
      </Field>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-rust text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-rust-700 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Saving...' : defaultValues ? 'Save changes' : 'Create trip'}
        </button>
        <a
          href="/admin/trips"
          className="px-6 py-2.5 rounded-lg text-sm text-ink/50 hover:text-ink transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/60 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-sand rounded-lg px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors'
