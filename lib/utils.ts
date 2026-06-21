import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LeadStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const sDay = s.getDate()
  const eDay = e.getDate()
  const sMonth = s.toLocaleString('en-IN', { month: 'short' })
  const eMonth = e.toLocaleString('en-IN', { month: 'short' })
  const year = e.getFullYear()

  if (sMonth === eMonth) {
    return `${sDay}–${eDay} ${sMonth} ${year}`
  }
  return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${year}`
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateStr)
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-sand-100 text-ink',
  contacted: 'bg-olive-100 text-olive',
  qualified: 'bg-rust-100 text-rust-700',
  vibe_check_sent: 'bg-yellow-50 text-ink',
  confirmed: 'bg-green-100 text-green-800',
  not_a_fit: 'bg-gray-100 text-gray-500',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  vibe_check_sent: 'Vibe check sent',
  confirmed: 'Confirmed',
  not_a_fit: 'Not a fit',
}
