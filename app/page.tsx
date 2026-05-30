'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const supabase = createBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    const { error } = await supabase
      .from('waitlist')
      .insert({
        email: email.toLowerCase().trim(),
        referrer: typeof document !== 'undefined' ? document.referrer : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      });

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(error.message);
      }
    } else {
      setStatus('success');
    }
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-neutral-100 selection:bg-neutral-850 overflow-hidden flex flex-col justify-between">
      {/* Soft neutral glows instead of purple/violet glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-900/10 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neutral-950/20 blur-[150px] pointer-events-none" />

      {/* Main navigation / Header */}
      <nav className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img src="/subkitt_icon.png" alt="SubKitt Logo" className="w-8 h-8 rounded-lg border border-neutral-900 shadow-md invert" />
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">SubKitt</span>
        </div>



        <a
          href="/login"
          className="glass border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition-all duration-300 active:scale-[0.98] hover:text-white"
        >
          Sign In
        </a>
      </nav>

      {/* Hero Body */}
      <div className="max-w-5xl w-full mx-auto px-6 py-12 md:py-24 z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left column: Copy & philosophy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800/80 rounded-full px-3.5 py-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-neutral-400 font-medium tracking-wide">Waitlist open · 50% off first 50 users</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent">
            You ship. <br />
            Your work turns <br />
            into inbound.
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-xl">
            SubKitt drafts your week&apos;s posts directly from what you shipped — keeping you inside your codebase while your audience grows on autopilot.
          </p>

          {/* Value points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            <div className="flex items-start gap-3">
              <span className="text-neutral-450 mt-1">✦</span>
              <p className="text-sm text-neutral-300 leading-relaxed">
                <strong className="text-neutral-200">Zero writing templates:</strong> Drafts modeled directly from actual code commits.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✦</span>
              <p className="text-sm text-neutral-300 leading-relaxed">
                <strong className="text-neutral-200">Set it and forget it:</strong> Every Monday, high-impact tweets land in your inbox.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Form & Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Action Box */}
          <div className="glass border border-neutral-800/80 rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-neutral-100/5 blur-[50px] pointer-events-none" />
            
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-100">Stop building in silence.</h2>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Create an account to connect your repositories, select your AI model, and preview drafts immediately.
              </p>
            </div>

            <a
              href="/login"
              className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98] text-sm text-center"
            >
              Get Started (Sign In / Sign Up) &rarr;
            </a>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-800/60"></div>
              <span className="flex-shrink mx-4 text-xs font-mono text-neutral-600 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-neutral-800/60"></div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-neutral-400 font-medium">Join waitlist for feature updates:</p>
              
              {status === 'success' ? (
                <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-xl p-4 text-emerald-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <span className="text-sm mt-0.5">✓</span>
                  <p className="leading-relaxed">You&apos;re in! We will notify you when SubKitt is ready for your account.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 disabled:opacity-50 text-xs transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white font-semibold py-3 px-5 rounded-xl transition disabled:opacity-50 text-xs whitespace-nowrap active:scale-[0.99]"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className="text-red-400 text-xs mt-2">Something went wrong: {errorMsg}</p>
              )}
            </div>
          </div>

          {/* Interactive Commit -> Post Visualization */}
          <div className="glass border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Live Sample Loop</span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/40">Active</span>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-600">Your Commit</span>
                <div className="bg-neutral-950/80 border border-neutral-800/40 rounded-xl p-3">
                  <code className="text-xs text-neutral-300 font-mono flex items-center gap-1.5">
                    <span className="text-neutral-450 font-bold">git commit -m</span> &quot;feat: add OAuth flow to settings page&quot;
                  </code>
                </div>
              </div>
              
              <div className="flex justify-center py-1">
                <div className="w-0.5 h-6 bg-gradient-to-b from-neutral-800 to-neutral-900" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-600">SubKitt X Draft</span>
                <div className="bg-neutral-950/80 border border-neutral-800/40 rounded-xl p-4">
                  <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                    Just shipped OAuth into SubKitt. If you&apos;ve ever spent a Tuesday fighting GitHub&apos;s token refresh flow, this one&apos;s for you. ⚡
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Philosophy & Timeline section */}
      <div className="max-w-5xl w-full mx-auto px-6 py-12 md:py-16 z-10 border-t border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', title: 'Connect GitHub', body: 'Link repositories from your secure dashboard. SubKitt parses commits, filtering logs to isolate features.' },
            { n: '02', title: 'Select AI & Style', body: 'Input your Gemini, OpenAI, or Claude key. Customize your writing voice—from senior dev to sarcastic shipper.' },
            { n: '03', title: 'Monday Morning Delivery', body: '5 ready-to-post drafts land in your inbox. Copy, refine, and release to keep building in public.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="space-y-2">
              <div className="text-xs font-mono text-neutral-600">{n}</div>
              <h3 className="font-bold text-neutral-200 text-sm">{title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Founder note */}
      <footer className="max-w-5xl w-full mx-auto px-6 py-8 z-10 border-t border-neutral-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start max-w-lg">
          <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 shrink-0 flex items-center justify-center text-xs font-bold text-neutral-400">H</div>
          <div className="space-y-1">
            <p className="text-xs text-neutral-300">
              Built by <strong className="text-neutral-200">Hassan</strong> · Solo builder shipping in public
            </p>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              I got tired of shipping features that went unseen. So I built this pipeline to automate content generation directly from my commit history.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 shrink-0">
          <a href="/brand" className="hover:text-neutral-300 transition-colors">
            Brand System
          </a>
          <span>·</span>
          <a href="https://x.com/CheemaEdu" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
            X (Twitter)
          </a>
          <span>·</span>
          <a href="https://github.com/Hassan-Cheema/subkitt" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
            GitHub
          </a>
        </div>

      </footer>
    </main>
  );
}
