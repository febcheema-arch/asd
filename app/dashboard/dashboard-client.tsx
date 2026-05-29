'use client'

import { useState } from 'react'

interface UserProfile {
  github_username: string
  github_email: string
  ai_provider?: string
  writing_tone?: string
}

interface DashboardClientProps {
  initialUser: UserProfile
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const [user, setUser] = useState<UserProfile>(initialUser)
  const [activeTab, setActiveTab] = useState<'drafts' | 'settings' | 'about'>('drafts')
  const [drafts, setDrafts] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Settings states
  const [aiProvider, setAiProvider] = useState<string>(initialUser.ai_provider || 'gemini')
  const [writingTone, setWritingTone] = useState<string>(initialUser.writing_tone || 'default')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  async function handleGenerate() {
    setStatus('loading')
    setMessage('')
    setDrafts([])

    try {
      const res = await fetch('/api/test-batch', { method: 'POST' })
      const data = await res.json()

      if (data.status === 'sent') {
        setStatus('success')
        setDrafts(data.drafts || [])
        setMessage('Drafts successfully generated and sent to your email!')
      } else if (data.status === 'no_commits') {
        setStatus('error')
        setMessage('No substantial commits found in the last 7 days. Make sure you pushed a commit as febcheema-arch!')
      } else if (data.status === 'no_drafts') {
        setStatus('error')
        setMessage("The AI couldn't generate drafts. Try again.")
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Failed to trigger generation. Check server connection.')
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSaveStatus('saving')

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ai_provider: aiProvider,
          writing_tone: writingTone,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSaveStatus('success')
        setUser(data.user)
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      setSaveStatus('error')
    }
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text)
    // Simple temporary alert or notification can go here
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-8 mb-10">
        <div>
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">GitHub Connected as @{user.github_username}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-100 tracking-tight">Founder Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage drafts, customize AI models, and review your logs.</p>
        </div>

        {/* Tab Controls */}
        <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'drafts'
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-700/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Drafts Panel
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'settings'
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-700/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            AI Settings
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'about'
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-700/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            How it Scans
          </button>
        </div>
      </header>

      {/* Main Tab Panels */}
      <main>
        {/* Panel 1: Drafts */}
        {activeTab === 'drafts' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Generate Action Card */}
            <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-100">Fetch & Generate Drafts</h2>
                <p className="text-neutral-400 text-sm mt-1 max-w-lg">
                  SubKitt will scan your GitHub commits pushed in the last 7 days and use **{user.ai_provider || 'gemini'}** in **{user.writing_tone || 'default'}** tone to compile 5 tweets.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={status === 'loading'}
                className="bg-neutral-100 text-neutral-950 font-bold px-6 py-3.5 rounded-xl hover:bg-white transition-all disabled:opacity-50 text-sm shrink-0 shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                {status === 'loading' ? 'Generating drafts...' : 'Generate test batch now'}
              </button>
            </div>

            {/* Notifications */}
            {message && (
              <div
                className={`p-4 rounded-xl border text-sm flex gap-3 items-start ${
                  status === 'success'
                    ? 'bg-green-950/30 border-green-900/60 text-green-300'
                    : 'bg-red-950/30 border-red-900/60 text-red-300'
                }`}
              >
                <span className="text-lg font-mono leading-none mt-0.5">{status === 'success' ? '✓' : '⚠'}</span>
                <div>
                  <h4 className="font-semibold">{status === 'success' ? 'Success' : 'Notice'}</h4>
                  <p className="mt-1 leading-relaxed opacity-90">{message}</p>
                </div>
              </div>
            )}

            {/* Generated Drafts List */}
            {drafts.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-300 uppercase tracking-widest text-xs">Generated Tweet Drafts</h3>
                <div className="grid gap-4">
                  {drafts.map((draft, i) => {
                    const charCount = draft.length
                    const isOverLimit = charCount > 280

                    return (
                      <div key={i} className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-5 hover:border-neutral-700/60 transition-all flex flex-col gap-4">
                        <div className="flex justify-between items-center text-xs text-neutral-500 font-mono">
                          <span>Draft {i + 1} / {drafts.length}</span>
                          <span className={isOverLimit ? 'text-red-400 font-bold' : ''}>{charCount} / 280 chars</span>
                        </div>
                        <textarea
                          defaultValue={draft}
                          onChange={(e) => {
                            drafts[i] = e.target.value
                          }}
                          className="bg-neutral-950/60 border border-neutral-800/60 focus:border-neutral-700 rounded-lg p-3 text-neutral-200 text-sm leading-relaxed focus:outline-none resize-y min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleCopy(draft, i)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold px-4 py-2.5 rounded-lg border border-neutral-700/40 transition active:scale-[0.98]"
                          >
                            Copy Draft
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : status !== 'loading' && (
              <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/10">
                <p className="text-neutral-500 text-sm">No drafts generated yet. Click generate above to scan commits.</p>
              </div>
            )}
          </div>
        )}

        {/* Panel 2: Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 animate-fadeIn max-w-xl">
            {/* AI Model Selector */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-md font-bold text-neutral-200">AI Model Provider</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Choose which AI engine writes your Monday drafts.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'gemini', label: 'Google Gemini', desc: 'gemini-2.5-flash' },
                  { id: 'openai', label: 'OpenAI GPT', desc: 'gpt-4o-mini' },
                  { id: 'anthropic', label: 'Anthropic Claude', desc: 'claude-3.5-haiku' },
                ].map((prov) => (
                  <label
                    key={prov.id}
                    className={`border rounded-xl p-4 flex flex-col justify-between h-24 cursor-pointer select-none transition-all ${
                      aiProvider === prov.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 font-bold'
                        : 'border-neutral-800 bg-neutral-950/20 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={prov.id}
                      checked={aiProvider === prov.id}
                      onChange={() => setAiProvider(prov.id)}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{prov.label}</span>
                    <span className={`text-[10px] uppercase tracking-wide font-mono ${aiProvider === prov.id ? 'text-neutral-600' : 'text-neutral-600'}`}>
                      {prov.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Writing Tone Selector */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-md font-bold text-neutral-200">Writing Style / Tone</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Control the voice and style of the generated drafts.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'default', label: 'Default Shipper', desc: "Direct, personal, sound like a real builder." },
                  { id: 'technical', label: 'Senior Engineer', desc: "Highly technical details, focus on architecture." },
                  { id: 'sarcastic', label: 'Sarcastic Dev', desc: "Funny, developer jokes, roasts startup culture." },
                  { id: 'hype', label: 'Hype Founder', desc: "Excited founder energy, celebrating velocity." },
                ].map((toneOpt) => (
                  <label
                    key={toneOpt.id}
                    className={`border rounded-xl p-4 flex flex-col justify-between h-28 cursor-pointer select-none transition-all ${
                      writingTone === toneOpt.id
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-950 font-bold'
                        : 'border-neutral-800 bg-neutral-950/20 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={toneOpt.id}
                      checked={writingTone === toneOpt.id}
                      onChange={() => setWritingTone(toneOpt.id)}
                      className="sr-only"
                    />
                    <div>
                      <span className="text-sm block">{toneOpt.label}</span>
                      <span className={`text-[11px] font-normal leading-relaxed mt-1 block ${writingTone === toneOpt.id ? 'text-neutral-700' : 'text-neutral-500'}`}>
                        {toneOpt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Settings Submit Button */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="bg-neutral-100 hover:bg-white text-neutral-950 font-bold px-6 py-3 rounded-lg text-sm transition active:scale-[0.98] disabled:opacity-50"
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Preferences'}
              </button>

              {saveStatus === 'success' && (
                <span className="text-green-400 text-sm font-semibold animate-pulse">✓ Saved successfully!</span>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-400 text-sm font-semibold">⚠ Failed to save settings.</span>
              )}
            </div>
          </form>
        )}

        {/* Panel 3: About Scans */}
        {activeTab === 'about' && (
          <div className="bg-neutral-900/20 border border-neutral-800 rounded-xl p-6 space-y-6 max-w-2xl animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-neutral-200">How SubKitt Processes Commits</h3>
              <p className="text-neutral-500 text-xs mt-0.5 font-mono">filter.ts Rules & Guidelines</p>
            </div>

            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-4">
                <span className="text-neutral-600 font-mono mt-0.5">01</span>
                <div>
                  <h4 className="font-semibold text-neutral-300">Filters Boring Commits</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    Merged pull requests, documentation updates, WIPs, lockfile adjustments, and typos are automatically skipped to avoid noisy drafts.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-neutral-600 font-mono mt-0.5">02</span>
                <div>
                  <h4 className="font-semibold text-neutral-300">Minimum Line-Change Threshold</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    By default, commits modifying fewer than 10 lines of code are filtered out.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-neutral-600 font-mono mt-0.5">03</span>
                <div>
                  <h4 className="font-semibold text-neutral-300">Feature Override Bypass</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    If a commit has a vital keyword (like `feat:`, `feature:`, `ship`, `release`, `implement`), it bypasses the 10-line restriction entirely.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}
