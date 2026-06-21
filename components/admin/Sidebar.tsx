'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/leads', label: 'Leads', exact: false },
  { href: '/admin/trips', label: 'Trips', exact: false },
]

interface Props {
  userEmail: string
  userName: string
}

export default function Sidebar({ userEmail, userName }: Props) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="w-56 shrink-0 bg-ink flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-7">
        <Link href="/admin">
          <span
            className="text-cream text-xl font-black tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            NOMICHI
          </span>
        </Link>
        <p className="text-ink/40 text-[10px] mt-0.5 text-cream/30 tracking-widest uppercase">
          Trip Desk
        </p>
      </div>

      {/* Rust divider */}
      <div className="mx-6 h-px bg-rust/40 mb-5" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive(href, exact)
                ? 'bg-rust text-white font-semibold'
                : 'text-cream/50 hover:text-cream hover:bg-white/5'
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/5">
        <p className="text-cream/60 text-xs font-medium truncate">{userName}</p>
        <p className="text-cream/30 text-xs truncate mt-0.5">{userEmail}</p>
        <form
          action={signOut}
          className="mt-3"
        >
          <button
            type="submit"
            className="text-xs text-cream/30 hover:text-cream/60 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
