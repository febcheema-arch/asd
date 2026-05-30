import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase-server'
import AdminClient from './admin-client'

export default async function AdminPage() {
  const cookieSupabase = await createClient()
  const { data: { user: authUser }, error: authErr } = await cookieSupabase.auth.getUser()

  if (authErr || !authUser) {
    redirect('/')
  }

  // Create service role client for admin-level bypass queries
  const supabaseService = createServerClient()

  // Check admin rights
  const { data: profile } = await supabaseService
    .from('users')
    .select('is_admin')
    .eq('id', authUser.id)
    .single()

  const isAuthorized = authUser.email === 'febcheema@gmail.com' || profile?.is_admin === true

  if (!isAuthorized) {
    redirect('/dashboard')
  }

  // Fetch metrics and tables concurrently using service role client
  const [waitlistRes, usersRes, batchesRes] = await Promise.all([
    supabaseService.from('waitlist').select('*').order('created_at', { ascending: false }),
    supabaseService.from('users').select('*').order('updated_at', { ascending: false }),
    supabaseService.from('draft_batches').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-850">
      <AdminClient
        initialWaitlist={waitlistRes.data || []}
        initialUsers={usersRes.data || []}
        initialBatches={batchesRes.data || []}
      />
    </main>
  )
}

