'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Trip } from '@/lib/types'

const MONTHS = [
  'January 2026', 'February 2026', 'March 2026', 'April 2026',
  'May 2026', 'June 2026', 'July 2026', 'August 2026',
  'September 2026', 'October 2026', 'November 2026', 'December 2026',
]

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  trip_id: z.string().uuid('Please select a trip'),
  group_type: z.enum(['solo', 'friends', 'couple', 'family'], {
    required_error: 'Tell us who you are travelling with',
  }),
  preferred_month: z.string().min(1, 'Choose a month that works for you'),
  vibe_text: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  trips: Trip[]
}

export default function EnquiryModal({ trips }: Props) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    function handleOpen(e: Event) {
      const tripId = (e as CustomEvent).detail?.tripId
      reset()
      setSubmitted(false)
      setServerError('')
      if (tripId) setValue('trip_id', tripId)
      setOpen(true)
    }
    window.addEventListener('nomichi:open-enquiry', handleOpen)
    return () => window.removeEventListener('nomichi:open-enquiry', handleOpen)
  }, [reset, setValue])

  function close() {
    setOpen(false)
  }

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? 'Something went wrong. Try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Something went wrong on our end. Try again or write to us directly.')
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 z-40 animate-in fade-in"
        onClick={close}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50">
        <div className="bg-cream rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-sand" />
          </div>

          <div className="px-6 pt-4 pb-8">
            {/* Close button */}
            <button
              onClick={close}
              className="float-right text-ink/30 hover:text-ink transition-colors text-xl leading-none ml-4"
              aria-label="Close"
            >
              ×
            </button>

            {submitted ? (
              /* Success state */
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-rust/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-rust text-2xl">✓</span>
                </div>
                <h2
                  className="text-2xl font-bold text-ink mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Your enquiry is with us.
                </h2>
                <p className="text-ink/60 text-sm leading-relaxed mb-1">
                  Someone from the team will be in touch within a day or two.
                </p>
                <p className="text-ink/40 text-sm italic">Travel that finds you.</p>
                <button
                  onClick={close}
                  className="mt-6 text-rust text-sm underline"
                >
                  Back to trips
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <h2
                  className="text-xl font-bold text-ink mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Send an enquiry
                </h2>
                <p className="text-ink/50 text-sm mb-6">
                  Tell us a little about yourself. We will take it from there.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Trip select */}
                  <Field label="Which trip" error={errors.trip_id?.message}>
                    <select
                      {...register('trip_id')}
                      className={inputCls(!!errors.trip_id)}
                    >
                      <option value="">Choose a trip</option>
                      {trips.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Name */}
                  <Field label="Your name" error={errors.name?.message}>
                    <input
                      type="text"
                      placeholder="Ananya Krishnan"
                      {...register('name')}
                      className={inputCls(!!errors.name)}
                    />
                  </Field>

                  {/* Phone */}
                  <Field label="Your phone" error={errors.phone?.message}>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className={inputCls(!!errors.phone)}
                    />
                  </Field>

                  {/* Email */}
                  <Field label="Your email" error={errors.email?.message}>
                    <input
                      type="email"
                      placeholder="you@gmail.com"
                      {...register('email')}
                      className={inputCls(!!errors.email)}
                    />
                  </Field>

                  {/* Group type */}
                  <Field
                    label="Who are you travelling with"
                    error={errors.group_type?.message}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {(['solo', 'friends', 'couple', 'family'] as const).map(
                        (g) => (
                          <label
                            key={g}
                            className="flex items-center gap-2 border border-sand rounded-lg px-3 py-2.5 cursor-pointer hover:border-rust transition-colors has-[:checked]:border-rust has-[:checked]:bg-rust/5"
                          >
                            <input
                              type="radio"
                              value={g}
                              {...register('group_type')}
                              className="accent-rust"
                            />
                            <span className="text-sm text-ink capitalize">{g}</span>
                          </label>
                        )
                      )}
                    </div>
                  </Field>

                  {/* Preferred month */}
                  <Field
                    label="When works for you"
                    error={errors.preferred_month?.message}
                  >
                    <select
                      {...register('preferred_month')}
                      className={inputCls(!!errors.preferred_month)}
                    >
                      <option value="">Choose a month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Vibe text */}
                  <Field label="What are you hoping this trip feels like">
                    <textarea
                      {...register('vibe_text')}
                      rows={3}
                      placeholder="Take your time with this one. No right answer."
                      className={inputCls(false) + ' resize-none'}
                    />
                  </Field>

                  {serverError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-rust text-white font-semibold rounded-xl py-3.5 text-sm hover:bg-rust-700 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Send enquiry'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/60 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? 'border-red-400' : 'border-sand'
    } rounded-lg px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors`
}
