'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { LeadStatus } from '@/lib/types'

// ── Leads ──────────────────────────────────────────────────────

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = createClient()
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/admin/leads')
}

export async function assignLeadOwner(leadId: string, ownerId: string | null) {
  const supabase = createClient()
  const { error } = await supabase
    .from('leads')
    .update({ owner_id: ownerId || null })
    .eq('id', leadId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${leadId}`)
}

// ── Touchpoints ───────────────────────────────────────────────

export async function addTouchpoint(
  leadId: string,
  note: string,
  nextAction: string
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('touchpoints').insert({
    lead_id: leadId,
    author_id: user?.id ?? null,
    note,
    next_action: nextAction.trim() || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${leadId}`)
}

// ── Trips ─────────────────────────────────────────────────────

export async function createTrip(formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase.from('trips').insert({
    name: formData.get('name') as string,
    destination: formData.get('destination') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    price_inr: parseInt(formData.get('price_inr') as string, 10),
    total_seats: parseInt(formData.get('total_seats') as string, 10),
    status: formData.get('status') as string,
    description: formData.get('description') as string,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/trips')
  revalidatePath('/')
  redirect('/admin/trips')
}

export async function updateTrip(id: string, formData: FormData) {
  const supabase = createClient()
  const { error } = await supabase
    .from('trips')
    .update({
      name: formData.get('name') as string,
      destination: formData.get('destination') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      price_inr: parseInt(formData.get('price_inr') as string, 10),
      total_seats: parseInt(formData.get('total_seats') as string, 10),
      status: formData.get('status') as string,
      description: formData.get('description') as string,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/trips')
  revalidatePath('/')
  redirect('/admin/trips')
}

export async function deleteTrip(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/trips')
  revalidatePath('/')
}

// ── Auth ──────────────────────────────────────────────────────

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
