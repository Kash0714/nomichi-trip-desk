'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next') ?? '/admin'

    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (mode === 'signin') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setError(error.message)
            } else {
                router.push(next)
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } },
            })
            if (error) {
                setError(error.message)
            } else {
                setDone(true)
            }
        }
        setLoading(false)
    }

    if (done) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-6">
                <div className="max-w-sm w-full text-center">
                    <h1 className="text-2xl font-bold text-ink mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                        Check your email
                    </h1>
                    <p className="text-ink/60 text-sm leading-relaxed">
                        We sent a confirmation link to <strong>{email}</strong>. Open it, then come back to sign in.
                    </p>
                    <button
                        onClick={() => { setMode('signin'); setDone(false) }}
                        className="mt-6 text-rust text-sm underline"
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-6">
            <div className="max-w-sm w-full">
                <h1
                    className="text-3xl font-black text-ink mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    NOMICHI
                </h1>
                <p className="text-ink/50 text-sm mb-8">Trip Desk — team access only</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-medium text-ink/60 mb-1.5 uppercase tracking-wide">
                                Your name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border border-sand rounded-lg px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
                                placeholder="Arjun Mehta"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-ink/60 mb-1.5 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full border border-sand rounded-lg px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
                            placeholder="you@thenomichi.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-ink/60 mb-1.5 uppercase tracking-wide">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                            className="w-full border border-sand rounded-lg px-4 py-3 text-sm bg-white text-ink focus:outline-none focus:border-rust transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rust text-white font-semibold rounded-lg py-3 text-sm hover:bg-rust-700 disabled:opacity-50 transition-colors"
                    >
                        {loading
                            ? 'One moment...'
                            : mode === 'signin'
                                ? 'Sign in'
                                : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                        className="text-sm text-ink/50 hover:text-rust transition-colors"
                    >
                        {mode === 'signin'
                            ? 'New to the team? Create an account'
                            : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    )
}
