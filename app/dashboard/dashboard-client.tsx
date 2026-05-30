'use client'

import { useState } from 'react'

interface UserProfile {
  id?: string
  github_username: string
  github_email: string
  ai_provider?: string
  writing_tone?: string
  gemini_api_key?: string
  openai_api_key?: string
  anthropic_api_key?: string
  is_admin?: boolean
}

interface DraftBatch {
  id: string
  drafts: string[]
  provider: string
  created_at: string
}

interface DashboardClientProps {
  initialUser: UserProfile
  initialBatches: DraftBatch[]
}

export default function DashboardClient({ initialUser, initialBatches }: DashboardClientProps) {
  const [user, setUser] = useState<UserProfile>(initialUser)
  const [batches, setBatches] = useState<DraftBatch[]>(initialBatches)
  const [activeTab, setActiveTab] = useState<'drafts' | 'history' | 'settings' | 'about'>('drafts')
  const [drafts, setDrafts] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null)

  // Settings states
  const [aiProvider, setAiProvider] = useState<string>(initialUser.ai_provider || 'gemini')
  const [writingTone, setWritingTone] = useState<string>(initialUser.writing_tone || 'default')
  const [geminiKey, setGeminiKey] = useState<string>(initialUser.gemini_api_key || '')
  const [openaiKey, setOpenaiKey] = useState<string>(initialUser.openai_api_key || '')
  const [anthropicKey, setAnthropicKey] = useState<string>(initialUser.anthropic_api_key || '')
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
        const generatedDrafts = data.drafts || []
        setDrafts(generatedDrafts)
        setMessage('Drafts successfully generated and sent to your email!')

        // Dynamically prepend new batch to history
        const newBatch: DraftBatch = {
          id: Math.random().toString(),
          drafts: generatedDrafts,
          provider: aiProvider,
          created_at: new Date().toISOString(),
        }
        setBatches(prev => [newBatch, ...prev])
      } else if (data.status === 'no_commits') {
        setStatus('error')
        setMessage('No substantial commits found in the last 7 days. Make sure you pushed a commit as your configured GitHub user!')
      } else if (data.status === 'no_drafts') {
        setStatus('error')
        setMessage("The AI couldn't generate drafts. Check your API key under settings.")
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
          gemini_api_key: geminiKey,
          openai_api_key: openaiKey,
          anthropic_api_key: anthropicKey,
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

  function handleCopy(text: string, index: number, isHistory = false, historyItemId = '') {
    navigator.clipboard.writeText(text)
    if (isHistory) {
      setCopiedHistoryId(historyItemId)
      setTimeout(() => setCopiedHistoryId(null), 2000)
    } else {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-neutral-800 pb-20 overflow-hidden">
      {/* Background ambient light sources (Soft neutral white/gray shadows instead of violet/indigo) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neutral-900/10 blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neutral-950/20 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 pt-8 z-10 relative space-y-8">
        
        {/* Navigation & Brand */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="20" height="20">
              <path
                d="M47 19 C47 13 38 11 30 13 C20 15.5 17 23 27 27.5 C41 33 44 39 37 46.5 C31 53 21 51.5 17 45"
                fill="none" stroke="white" strokeWidth="7.5" strokeLinecap="round"
              />
            </svg>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">SubKitt Dashboard</h1>
              <p className="text-[11px] text-neutral-500">Manage pipeline settings and historical drafts.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.is_admin && (
              <a
                href="/admin"
                className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-semibold px-4 py-2 rounded-xl transition text-xs whitespace-nowrap active:scale-[0.98] shadow-sm"
              >
                Admin Panel
              </a>
            )}
            <a
              href="/api/auth/logout"
              className="glass border border-neutral-850 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-350 hover:text-white font-medium px-4 py-2 rounded-xl transition text-xs whitespace-nowrap active:scale-[0.98]"
            >
              Sign Out
            </a>
          </div>
        </header>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* GitHub Status */}
          <div className="glass border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-28 hover:border-neutral-800 transition duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">GitHub Connection</span>
            {user.github_username ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-neutral-200">@{user.github_username}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-semibold text-amber-400">Disconnected</span>
              </div>
            )}
            <span className="text-[10px] text-neutral-500">Linked profile account repository</span>
          </div>

          {/* AI Settings */}
          <div className="glass border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-28 hover:border-neutral-800 transition duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Active AI Engine</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-neutral-200 capitalize">{user.ai_provider || 'Gemini'} ({user.writing_tone || 'Default'})</span>
            </div>
            <span className="text-[10px] text-neutral-500">Configured provider & tone style</span>
          </div>


          {/* Batches Count */}
          <div className="glass border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-28 hover:border-neutral-800 transition duration-300">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Saved Batches</span>
            <span className="text-xl font-bold text-neutral-200">{batches.length} Generated</span>
            <span className="text-[10px] text-neutral-500">Archived logs in draft history</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-900 pb-px">
          <div className="flex gap-2 p-1 bg-neutral-950 border border-neutral-900 rounded-xl">
            {[
              { id: 'drafts', label: 'Draft Panel' },
              { id: 'history', label: 'History Logs' },
              { id: 'settings', label: 'AI Settings' },
              { id: 'about', label: 'How it Scans' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setMessage('')
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white border border-neutral-800/80 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tabs Body */}
        <main className="min-h-[400px]">
          {/* TAB 1: DRAFTS PANEL */}
          {activeTab === 'drafts' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Connect / Trigger Action Card */}
              {!user.github_username ? (
                <div className="glass border border-neutral-850 hover:border-neutral-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition duration-300">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-neutral-200">Connect GitHub to Start Scanning</h2>
                    <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                      Before drafting tweets, you must link your GitHub account. SubKitt scans and filters repositories you commit code to.
                    </p>
                  </div>
                  <a
                    href="/api/auth/github"
                    className="inline-flex justify-center items-center bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-6 py-3 rounded-xl transition duration-300 text-xs shrink-0 shadow-md shadow-white/5 active:scale-[0.98]"
                  >
                    Link GitHub Account
                  </a>
                </div>
              ) : (
                <div className="glass border border-neutral-850 hover:border-neutral-850 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition duration-300">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-neutral-200">Generate Weekly Tweet Drafts</h2>
                    <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                      Scan all commits pushed to your repositories in the last 7 days. Compiles 5 ready-to-publish drafts matching your tone preferences.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={status === 'loading'}
                    className="bg-white hover:bg-neutral-150 disabled:opacity-50 text-neutral-950 font-bold px-6 py-3 rounded-xl transition duration-300 text-xs shrink-0 shadow-md shadow-white/5 active:scale-[0.98]"
                  >
                    {status === 'loading' ? 'Analyzing Commits...' : 'Scan Commits & Generate'}
                  </button>
                </div>
              )}

              {/* Message notifications */}
              {message && (
                <div
                  className={`p-4 rounded-xl border text-xs flex gap-3 items-start animate-fadeIn ${
                    status === 'success'
                      ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-400'
                      : 'bg-red-950/20 border-red-900/60 text-red-400'
                  }`}
                >
                  <span className="text-sm leading-none mt-0.5">{status === 'success' ? '✓' : '⚠'}</span>
                  <div>
                    <h4 className="font-semibold">{status === 'success' ? 'Success' : 'Notice'}</h4>
                    <p className="mt-1 leading-relaxed opacity-90">{message}</p>
                  </div>
                </div>
              )}

              {/* Draft Cards Grid */}
              {drafts.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Interactive drafts output</span>
                    <span className="text-xs text-neutral-450 font-mono">5 items ready</span>
                  </div>
                  
                  <div className="grid gap-5">
                    {drafts.map((draft, i) => {
                      const charCount = draft.length
                      const isOverLimit = charCount > 280

                      return (
                        <div key={i} className="glass border border-neutral-900 hover:border-neutral-850 rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col gap-4">
                          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono">
                            <span className="font-semibold text-neutral-450">DRAFT {i + 1} OF 5</span>
                            <span className={`${isOverLimit ? 'text-red-400 font-bold' : 'text-neutral-450'}`}>{charCount} / 280 chars</span>
                          </div>
                          
                          <textarea
                            defaultValue={draft}
                            onChange={(e) => {
                              drafts[i] = e.target.value
                            }}
                            className="bg-neutral-950/80 border border-neutral-900 focus:border-neutral-850 focus:bg-neutral-950 rounded-xl p-4 text-neutral-200 text-xs leading-relaxed focus:outline-none resize-y min-h-[90px] transition"
                          />
                          
                          <div className="flex justify-end items-center">
                            <button
                              onClick={() => handleCopy(drafts[i], i)}
                              className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-350 hover:text-white text-xs font-semibold px-4 py-2 rounded-lg transition active:scale-[0.98] flex items-center gap-1.5"
                            >
                              {copiedIndex === i ? (
                                <>
                                  <span className="text-emerald-400">✓</span>
                                  <span className="text-emerald-400 font-mono text-[10px] uppercase">Copied!</span>
                                </>
                              ) : (
                                <span>Copy Tweet</span>
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : status !== 'loading' && (
                <div className="text-center py-16 border border-dashed border-neutral-900 rounded-2xl bg-neutral-950/20">
                  <p className="text-neutral-500 text-xs">No drafts generated in this view session. Trigger a scan above.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORY LOG */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-neutral-250">Chronological Draft History</h3>
                <p className="text-neutral-500 text-[10px] mt-0.5">Access previous batches saved under your founder account.</p>
              </div>

              {batches.length > 0 ? (
                <div className="space-y-6">
                  {batches.map((batch) => (
                    <div key={batch.id} className="glass border border-neutral-900 rounded-2xl p-5 md:p-6 space-y-4 hover:border-neutral-850 transition">
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-3 text-[10px] text-neutral-500 font-mono">
                        <span>ENGINE: <b className="text-neutral-350 uppercase">{batch.provider}</b></span>
                        <span>{new Date(batch.created_at).toLocaleString()}</span>
                      </div>

                      <div className="space-y-3">
                        {batch.drafts.map((d, index) => {
                          const itemId = `${batch.id}-${index}`
                          return (
                            <div key={index} className="flex justify-between items-start gap-4 p-4 bg-neutral-950/60 rounded-xl border border-neutral-900/60 text-neutral-300 text-xs leading-relaxed">
                              <p className="flex-1">{d}</p>
                              <button
                                onClick={() => handleCopy(d, 0, true, itemId)}
                                className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white text-[9px] font-mono uppercase px-2.5 py-1.5 rounded transition shrink-0"
                              >
                                {copiedHistoryId === itemId ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-neutral-900 rounded-2xl bg-neutral-950/20">
                  <p className="text-neutral-500 text-xs">No saved history logs found. Run a generation scan to save drafts.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn max-w-xl">
              
              {/* Provider Selection */}
              <div className="glass border border-neutral-900 rounded-2xl p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-250">AI Model Provider</h3>
                  <p className="text-neutral-500 text-[10px] mt-0.5">Select the intelligence layer for compiling tweet variations.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gemini', label: 'Google Gemini', desc: 'gemini-2.5-flash' },
                    { id: 'openai', label: 'OpenAI GPT', desc: 'gpt-4o-mini' },
                    { id: 'anthropic', label: 'Anthropic Claude', desc: 'claude-3.5-haiku' },
                  ].map((prov) => (
                    <label
                      key={prov.id}
                      className={`border rounded-xl p-4 flex flex-col justify-between h-24 cursor-pointer select-none transition-all duration-300 ${
                        aiProvider === prov.id
                          ? 'border-neutral-200 bg-white text-neutral-950 font-bold'
                          : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
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
                      <span className="text-xs font-semibold">{prov.label}</span>
                      <span className="text-[9px] uppercase tracking-wide font-mono opacity-80">
                        {prov.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Secure API Key Inputs */}
              <div className="glass border border-neutral-900 rounded-2xl p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-250">Personal API Keys</h3>
                  <p className="text-neutral-500 text-[10px] mt-0.5">Your credentials are saved directly to your account. If omitted, default system keys apply.</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">Gemini Key</label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none text-xs transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">OpenAI Key</label>
                    <input
                      type="password"
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none text-xs transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">Anthropic Claude Key</label>
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full bg-neutral-950/60 border border-neutral-900 focus:border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none text-xs transition duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Tone style selection */}
              <div className="glass border border-neutral-900 rounded-2xl p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-250">Writing Style / Voice</h3>
                  <p className="text-neutral-500 text-[10px] mt-0.5">Control the voice and style of the generated drafts.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'default', label: 'Default Shipper', desc: "Direct, personal, sound like a real builder." },
                    { id: 'technical', label: 'Senior Engineer', desc: "Highly technical details, focus on architecture." },
                    { id: 'sarcastic', label: 'Sarcastic Dev', desc: "Funny, developer jokes, roasts startup culture." },
                    { id: 'hype', label: 'Hype Founder', desc: "Excited founder energy, celebrating velocity." },
                  ].map((toneOpt) => (
                    <label
                      key={toneOpt.id}
                      className={`border rounded-xl p-4 flex flex-col justify-between h-24 cursor-pointer select-none transition-all duration-300 ${
                        writingTone === toneOpt.id
                          ? 'border-neutral-200 bg-white text-neutral-950 font-bold'
                          : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
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
                        <span className="text-xs block">{toneOpt.label}</span>
                        <span className={`text-[10px] font-normal mt-1 block leading-normal ${writingTone === toneOpt.id ? 'text-neutral-700' : 'text-neutral-500'}`}>
                          {toneOpt.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferences Submission buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saveStatus === 'saving'}
                  className="bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-5 py-3 rounded-xl text-xs transition duration-300 active:scale-[0.98] disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? 'Saving Settings...' : 'Save Preferences'}
                </button>

                {saveStatus === 'success' && (
                  <span className="text-emerald-400 text-xs font-semibold animate-pulse">✓ Settings saved!</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-400 text-xs font-semibold">⚠ Failed to update settings.</span>
                )}
              </div>
            </form>
          )}

          {/* TAB 4: HOW IT SCANS */}
          {activeTab === 'about' && (
            <div className="glass border border-neutral-900 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl animate-fadeIn">
              <div>
                <h3 className="text-sm font-bold text-neutral-250">How SubKitt Processes Commits</h3>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">filter.ts Rules & Guidelines</p>
              </div>

              <ul className="space-y-5 text-xs text-neutral-450 leading-relaxed">
                <li className="flex gap-4">
                  <span className="text-neutral-600 font-mono">01</span>
                  <div>
                    <h4 className="font-semibold text-neutral-300 text-xs">Skips Boring Commits</h4>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Merged pull requests, documentation updates, WIPs, lockfile adjustments, and typos are automatically skipped to avoid noisy drafts.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-neutral-600 font-mono">02</span>
                  <div>
                    <h4 className="font-semibold text-neutral-300 text-xs">Minimum Line-Change Threshold</h4>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      By default, commits modifying fewer than 10 lines of code are filtered out to focus on meaningful additions.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-neutral-600 font-mono">03</span>
                  <div>
                    <h4 className="font-semibold text-neutral-300 text-xs">Feature Keyword Override</h4>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      If a commit has a vital keyword (like `feat:`, `feature:`, `ship`, `release`, `implement`), it bypasses the 10-line restriction entirely.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
