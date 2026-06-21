export type TripStatus = 'open' | 'closed'

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'vibe_check_sent'
  | 'confirmed'
  | 'not_a_fit'

export type GroupType = 'solo' | 'friends' | 'couple' | 'family'

export type VibeFit = 'likely' | 'maybe' | 'unclear'

export interface Trip {
  id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  price_inr: number
  total_seats: number
  status: TripStatus
  description: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  role: 'associate' | 'manager'
  created_at: string
}

export interface Lead {
  id: string
  trip_id: string | null
  owner_id: string | null
  name: string
  phone: string
  email: string
  group_type: GroupType
  preferred_month: string
  vibe_text: string | null
  status: LeadStatus
  ai_vibe_fit: VibeFit | null
  ai_vibe_reason: string | null
  created_at: string
  updated_at: string
  // joined
  trip?: Trip | null
  owner?: Profile | null
}

export interface Touchpoint {
  id: string
  lead_id: string
  author_id: string | null
  note: string
  next_action: string | null
  created_at: string
  // joined
  author?: Profile | null
}

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'vibe_check_sent', label: 'Vibe check sent' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'not_a_fit', label: 'Not a fit' },
]

export const STATUS_PIPELINE: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'vibe_check_sent',
  'confirmed',
]

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  solo: 'Solo',
  friends: 'Friends',
  couple: 'Couple',
  family: 'Family',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  vibe_check_sent: 'Vibe check sent',
  confirmed: 'Confirmed',
  not_a_fit: 'Not a fit',
}