'use client'

import { useState } from 'react'

export default function BrandPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [typedSpecimen, setTypedSpecimen] = useState('SubKitt: Your work turns into inbound.')
  const [logoTab, setLogoTab] = useState<'icon' | 'full' | 'light'>('icon')
  const [copiedCode, setCopiedCode] = useState<'svg' | 'btn-primary' | 'btn-glass' | null>(null)

  function handleCopyHex(hex: string, label: string) {
    navigator.clipboard.writeText(hex)
    setCopiedToken(label)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  function handleCopyText(text: string, type: 'svg' | 'btn-primary' | 'btn-glass') {
    navigator.clipboard.writeText(text)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const colorTokens = [
    { label: 'Background Obsidian', hex: '#050505', desc: 'Main dark background layout canvas' },
    { label: 'Card Obsidian', hex: '#0a0a0a', desc: 'Glass panels and context card overlays' },
    { label: 'Border Charcoal', hex: '#171717', desc: 'Default subtle boundaries and separator lines' },
    { label: 'Accent Emerald', hex: '#10b981', desc: 'Active pipeline logs and verification states' },
    { label: 'Text Off-White', hex: '#fafafa', desc: 'Primary headers and titles' },
    { label: 'Text Muted Gray', hex: '#a3a3a3', desc: 'Body paragraphs and descriptive text' },
  ]

  const rawSvgIcon = `<svg viewBox="0 0 100 100" fill="none" stroke="#10b981" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
  <!-- Code brackets -->
  <path d="M 25 35 L 12 50 L 25 65" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 75 35 L 88 50 L 75 65" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Geometric Cat face -->
  <path d="M 32 40 L 40 25 L 48 37 C 49 37, 51 37, 52 37 L 60 25 L 68 40 L 65 65 C 60 75, 40 75, 35 65 Z" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Eyes -->
  <path d="M 40 48 L 44 48" stroke-linecap="round" />
  <path d="M 56 48 L 60 48" stroke-linecap="round" />
  <!-- Nose/Mouth -->
  <path d="M 48 56 L 50 58 L 52 56" stroke-linecap="round" stroke-linejoin="round" />
</svg>`

  const rawSvgFull = `<svg viewBox="0 0 280 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon Portion -->
  <g stroke="#10b981" stroke-width="2">
    <path d="M 25 35 L 12 50 L 25 65" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 75 35 L 88 50 L 75 65" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 32 40 L 40 25 L 48 37 C 49 37, 51 37, 52 37 L 60 25 L 68 40 L 65 65 C 60 75, 40 75, 35 65 Z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 40 48 L 44 48" stroke-linecap="round" />
    <path d="M 56 48 L 60 48" stroke-linecap="round" />
    <path d="M 48 56 L 50 58 L 52 56" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <!-- Wordmark Portion -->
  <text x="100" y="58" fill="#fafafa" font-family="system-ui, sans-serif" font-weight="900" font-size="28" letter-spacing="-1">SubKitt</text>
</svg>`

  return (
    <main className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-neutral-850 pb-24 overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-neutral-900/10 blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-neutral-950/20 blur-[130px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img src="/subkitt_icon.png" alt="SubKitt Logo" className="w-8 h-8 rounded-lg border border-neutral-900 shadow-md invert" />
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">SubKitt Brand Guidelines</span>
        </div>



        <a
          href="/"
          className="glass border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition active:scale-[0.98]"
        >
          Back to Home
        </a>
      </nav>

      {/* Main Brand Guidelines Frame */}
      <div className="max-w-4xl w-full mx-auto px-6 py-12 z-10 space-y-16">
        
        {/* Intro Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800/80 rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest">Brand Guidelines v1.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Sleek. Minimalist. Developer-First.
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            SubKitt is designed for developers who build in public. Our brand guidelines emphasize structure, code layouts, clean high-contrast tones, and absolute precision.
          </p>
        </section>

        {/* Brand Kit Assets Grid */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Brand Kit Assets</h2>
            <p className="text-xs text-neutral-450 mt-1">Download individual high-resolution brand assets generated for SubKitt.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Asset 1: Brand Icon */}
            <div className="glass border border-neutral-900 rounded-3xl p-5 hover:border-neutral-800 transition flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">SubKitt Icon Logo</span>
                <div className="border border-neutral-950 bg-neutral-950/60 rounded-2xl p-4 flex items-center justify-center h-48 overflow-hidden">
                  <img src="/subkitt_icon.png" alt="SubKitt Icon Logo" className="max-h-full rounded-xl" />
                </div>
              </div>
              <a
                href="/subkitt_icon.png"
                download
                className="w-full text-center bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 py-2 rounded-xl text-xs transition duration-300 font-semibold"
              >
                Download PNG Icon
              </a>
            </div>

            {/* Asset 2: Brand Wordmark */}
            <div className="glass border border-neutral-900 rounded-3xl p-5 hover:border-neutral-800 transition flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">SubKitt Brand Wordmark</span>
                <div className="border border-neutral-950 bg-neutral-950/60 rounded-2xl p-4 flex items-center justify-center h-48 overflow-hidden">
                  <img src="/subkitt_wordmark.png" alt="SubKitt Wordmark Logo" className="max-h-full rounded-xl" />
                </div>
              </div>
              <a
                href="/subkitt_wordmark.png"
                download
                className="w-full text-center bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 py-2 rounded-xl text-xs transition duration-300 font-semibold"
              >
                Download PNG Wordmark
              </a>
            </div>
          </div>

          {/* Asset 3: Full App UI Mockup */}
          <div className="glass border border-neutral-900 rounded-3xl p-6 hover:border-neutral-800 transition space-y-4">
            <div className="flex justify-between items-center text-[10px] text-neutral-550 font-mono uppercase tracking-wider">
              <span>App Interface Dashboard Mockup</span>
              <span>16:9 High-Res Screen</span>
            </div>
            <div className="border border-neutral-950 bg-neutral-950/40 rounded-2xl p-3 overflow-hidden">
              <img src="/subkitt_app_mockup.png" alt="SubKitt Dashboard Interface Mockup" className="w-full rounded-xl border border-neutral-950 shadow-inner" />
            </div>
            <div className="flex justify-end">
              <a
                href="/subkitt_app_mockup.png"
                download
                className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 px-6 py-2.5 rounded-xl text-xs transition duration-300 font-semibold"
              >
                Download Dashboard Mockup
              </a>
            </div>
          </div>
        </section>


        {/* LOGO SYSTEM SECTION */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Logo System (SVG)</h2>
            <p className="text-xs text-neutral-400 mt-1">Our logo combines geometric cat head elements framed by programming code brackets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Preview Frame */}
            <div className="md:col-span-7 space-y-4">
              {/* Tab selector */}
              <div className="flex bg-neutral-950 border border-neutral-900 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setLogoTab('icon')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    logoTab === 'icon' ? 'bg-neutral-900 text-white border border-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Icon Only (Dark)
                </button>
                <button
                  onClick={() => setLogoTab('full')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    logoTab === 'full' ? 'bg-neutral-900 text-white border border-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Full Wordmark (Dark)
                </button>
                <button
                  onClick={() => setLogoTab('light')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    logoTab === 'light' ? 'bg-neutral-900 text-white border border-neutral-800' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Icon (Light BG)
                </button>
              </div>

              {/* Rendering canvas */}
              <div
                className={`border border-neutral-900 rounded-3xl h-64 flex items-center justify-center p-8 transition-colors duration-300 ${
                  logoTab === 'light' ? 'bg-[#FAFAFA]' : 'bg-[#0A0A0A]/40'
                }`}
              >
                {logoTab === 'icon' && (
                  <svg viewBox="0 0 100 100" className="w-28 h-28 text-emerald-500 fill-none stroke-current" strokeWidth="2.2">
                    <path d="M 25 35 L 12 50 L 25 65" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 75 35 L 88 50 L 75 65" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 32 40 L 40 25 L 48 37 C 49 37, 51 37, 52 37 L 60 25 L 68 40 L 65 65 C 60 75, 40 75, 35 65 Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 40 48 L 44 48" strokeLinecap="round" />
                    <path d="M 56 48 L 60 48" strokeLinecap="round" />
                    <path d="M 48 56 L 50 58 L 52 56" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}

                {logoTab === 'full' && (
                  <svg viewBox="0 0 280 100" className="w-full max-w-sm fill-none" strokeWidth="2">
                    <g stroke="#10b981">
                      <path d="M 25 35 L 12 50 L 25 65" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 75 35 L 88 50 L 75 65" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 32 40 L 40 25 L 48 37 C 49 37, 51 37, 52 37 L 60 25 L 68 40 L 65 65 C 60 75, 40 75, 35 65 Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 40 48 L 44 48" strokeLinecap="round" />
                      <path d="M 56 48 L 60 48" strokeLinecap="round" />
                      <path d="M 48 56 L 50 58 L 52 56" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <text x="100" y="58" fill="#fafafa" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1">SubKitt</text>
                  </svg>
                )}

                {logoTab === 'light' && (
                  <svg viewBox="0 0 100 100" className="w-28 h-28 text-emerald-600 fill-none stroke-current" strokeWidth="2.2">
                    <path d="M 25 35 L 12 50 L 25 65" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 75 35 L 88 50 L 75 65" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 32 40 L 40 25 L 48 37 C 49 37, 51 37, 52 37 L 60 25 L 68 40 L 65 65 C 60 75, 40 75, 35 65 Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 40 48 L 44 48" strokeLinecap="round" />
                    <path d="M 56 48 L 60 48" strokeLinecap="round" />
                    <path d="M 48 56 L 50 58 L 52 56" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>

            {/* Right: SVG Code Downloader */}
            <div className="md:col-span-5 space-y-4">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">RAW SVG SOURCE CODE</span>
              <div className="relative">
                <pre className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 text-[10px] text-neutral-400 font-mono overflow-x-auto max-h-52">
                  <code>{logoTab === 'full' ? rawSvgFull : rawSvgIcon}</code>
                </pre>
                <button
                  onClick={() => handleCopyText(logoTab === 'full' ? rawSvgFull : rawSvgIcon, 'svg')}
                  className="absolute top-3 right-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-[9px] font-semibold border border-neutral-800/80 transition active:scale-[0.98]"
                >
                  {copiedCode === 'svg' ? 'Copied' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COLOR PALETTE TOKENS */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Color Token System</h2>
            <p className="text-xs text-neutral-400 mt-1">Our palette consists of clean developer dark grays, off-white headers, and emerald accents.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {colorTokens.map((token) => (
              <button
                key={token.label}
                onClick={() => handleCopyHex(token.hex, token.label)}
                className="glass border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-32 text-left hover:border-neutral-800 transition duration-300 relative group active:scale-[0.99]"
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-200">{token.label}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{token.desc}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-md border border-neutral-850 shadow-inner shrink-0"
                    style={{ backgroundColor: token.hex }}
                  />
                </div>
                <div className="flex justify-between items-center w-full text-[10px] font-mono text-neutral-400 pt-3 border-t border-neutral-950">
                  <span>{token.hex}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-600 group-hover:text-neutral-400 transition-colors">
                    {copiedToken === token.label ? 'Copied ✓' : 'Click to copy'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY PLAYGROUND */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Typography System</h2>
            <p className="text-xs text-neutral-400 mt-1">Interactive specimen viewer. Input your text below to inspect font sizes.</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={typedSpecimen}
              onChange={(e) => setTypedSpecimen(e.target.value)}
              placeholder="Test layout specimen..."
              className="w-full bg-neutral-950/60 border border-neutral-800 focus:border-neutral-700 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none text-xs transition duration-300"
            />

            <div className="glass border border-neutral-900 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-2 border-b border-neutral-900 pb-6">
                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Primary Brand Font — Geist Sans</span>
                <p className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight leading-tight">
                  {typedSpecimen || 'Enter custom layout text'}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                  Used for main headers, claims, card values, and button titles to show clean high-tech structure.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Secondary Code Font — Geist Mono</span>
                <p className="text-sm font-mono text-neutral-300 tracking-wide break-words">
                  {typedSpecimen.toLowerCase().replace(/\s+/g, '_') || 'enter_custom_layout_text'}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
                  Used for status outputs, code syntax layouts, git commands, and date stamps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND BUTTON STYLE SPEC SHEET */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Component Design Specs</h2>
            <p className="text-xs text-neutral-400 mt-1">Copy utility classes representing our core brand UI buttons.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Action button preview */}
            <div className="glass border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-neutral-800 transition">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">1. Brand Primary Button</span>
                <div className="h-14 flex items-center justify-center bg-neutral-950 border border-neutral-900 rounded-xl">
                  <button className="bg-white text-neutral-950 font-bold px-6 py-2.5 rounded-xl text-xs">
                    Primary Action
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-3 text-[9px] text-neutral-400 font-mono overflow-x-auto">
                  <code>{`className="bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-6 py-3 rounded-xl text-xs transition duration-300 active:scale-[0.98] shadow-md shadow-white/5"`}</code>
                </pre>
                <button
                  onClick={() => handleCopyText(`bg-white hover:bg-neutral-100 text-neutral-950 font-bold px-6 py-3 rounded-xl text-xs transition duration-300 active:scale-[0.98] shadow-md shadow-white/5`, 'btn-primary')}
                  className="absolute bottom-2.5 right-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-[8px] border border-neutral-800 transition"
                >
                  {copiedCode === 'btn-primary' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Secondary Glass action button preview */}
            <div className="glass border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-neutral-800 transition">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">2. Brand Glass Button</span>
                <div className="h-14 flex items-center justify-center bg-neutral-950 border border-neutral-900 rounded-xl">
                  <button className="glass border border-neutral-800 text-neutral-250 font-semibold px-6 py-2.5 rounded-xl text-xs">
                    Secondary Link
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-3 text-[9px] text-neutral-400 font-mono overflow-x-auto">
                  <code>{`className="glass border border-neutral-800 hover:border-neutral-700 text-neutral-250 hover:text-white font-semibold px-6 py-3 rounded-xl text-xs transition duration-300 active:scale-[0.98]"`}</code>
                </pre>
                <button
                  onClick={() => handleCopyText(`glass border border-neutral-800 hover:border-neutral-700 text-neutral-250 hover:text-white font-semibold px-6 py-3 rounded-xl text-xs transition duration-300 active:scale-[0.98]`, 'btn-glass')}
                  className="absolute bottom-2.5 right-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-[8px] border border-neutral-800 transition"
                >
                  {copiedCode === 'btn-glass' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* VOICE AND TONE SYSTEM */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-neutral-500 font-mono">Voice & Tone parameters</h2>
            <p className="text-xs text-neutral-400 mt-1">The principles guiding SubKitt tweet draft compilation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: '1. No Creator Fluff', desc: 'We do not draft threads about "10 tools I use to write code." We write direct updates about actual features shipped to production.' },
              { title: '2. Focus on the Outcome', desc: 'Drafts focus on the value shipped to developers or users. Show, don&apos;t just tell. Let code updates speak.' },
              { title: '3. Technical Precision', desc: 'Maintain technical accuracy. Use proper architectural terms, API definitions, and developer concepts cleanly.' },
              { title: '4. Absolute Velocity', desc: 'Drafts sound active, lightweight, and fast. Emphasize continuous progress and shipping frequency.' },
            ].map((p, idx) => (
              <div key={idx} className="glass border border-neutral-900 rounded-2xl p-5 space-y-2">
                <h3 className="text-xs font-bold text-neutral-250">{p.title}</h3>
                <p className="text-neutral-450 text-[11px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-6 border-t border-neutral-900/60 flex items-center justify-between text-xs text-neutral-500">
        <span>© {new Date().getFullYear()} SubKitt. All rights reserved.</span>
        <span>Developer Aesthetics System</span>
      </footer>
    </main>
  )
}
