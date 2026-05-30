'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    setErrorMsg('')

    try {
      const emailClean = email.toLowerCase().trim()

      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailClean,
          password,
        })

        if (error) {
          setErrorMsg(error.message)
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: emailClean,
          password,
        })

        if (error) {
          setErrorMsg(error.message)
        } else {
          if (data?.session) {
            router.push('/dashboard')
            router.refresh()
          } else {
            setErrorMsg('Account created! Please check your email to confirm registration or sign in if confirmation is disabled.')
          }
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected authentication error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-neutral-100 flex items-center justify-center p-6 selection:bg-neutral-800 overflow-hidden">
      {/* Decorative glows (Soft white neutral glows instead of violet/indigo) */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-neutral-900/10 blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-neutral-950/20 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-6">
        {/* Back navigation */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 border border-neutral-900 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-800 rounded-full px-4 py-1.5 transition text-xs text-neutral-400"
          >
            <span>←</span> Back to home page
          </a>
        </div>

        {/* Auth Card */}
        <div className="glass border border-neutral-800/80 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-neutral-100/5 blur-[40px] pointer-events-none" />


          {/* Heading */}
          <div className="mb-8 space-y-4">
            <img src="/subkitt_icon.png" alt="SubKitt Logo" className="w-8 h-8 rounded-lg border border-neutral-900 shadow-md invert" />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">

                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>

              <p className="text-xs text-neutral-400 mt-1">
                {mode === 'login'
                  ? 'Sign in to access your SubKitt dashboard & history.'
                  : 'Get 5 drafts written automatically from your code commits.'}
              </p>
            </div>
          </div>


          {/* Tab Switcher */}
          <div className="flex bg-neutral-950/80 border border-neutral-900 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setMode('login')
                setErrorMsg('')
              }}
              className={`flex-grow py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-neutral-900 text-neutral-100 border border-neutral-800/60 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup')
                setErrorMsg('')
              }}
              className={`flex-grow py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-neutral-900 text-neutral-100 border border-neutral-800/60 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                disabled={loading}
                className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-neutral-700 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none disabled:opacity-50 text-xs transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-neutral-700 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none disabled:opacity-50 text-xs transition-colors duration-300"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-950/20 border border-red-900/60 p-3.5 rounded-xl text-red-400 text-xs leading-relaxed flex gap-2.5 animate-fadeIn">
                <span className="font-bold">⚠</span>
                <span className="opacity-90">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-100 hover:bg-white text-neutral-950 font-bold py-3.5 rounded-xl transition duration-300 disabled:opacity-50 text-xs mt-4 shadow-lg shadow-white/5 active:scale-[0.99]"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Enter' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-neutral-600">
          Secure authentication managed by Supabase Auth
        </p>
      </div>
    </main>
  )
}
