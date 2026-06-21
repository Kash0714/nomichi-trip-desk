import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Use service-role-free anon client — RLS allows anon inserts on leads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(
      /^[\+]?[\d\s\-\(\)]{7,20}$/,
      'Enter a valid phone number'
    ),
  email: z.string().email('Enter a valid email'),
  trip_id: z.string().uuid('Please select a trip'),
  group_type: z.enum(['solo', 'friends', 'couple', 'family']),
  preferred_month: z.string().min(1, 'Please choose a month'),
  vibe_text: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('leads').insert({
      ...parsed.data,
      vibe_text: parsed.data.vibe_text || null,
      status: 'new',
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Something went wrong on our end. Try again shortly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
