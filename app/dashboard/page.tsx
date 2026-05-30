import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './dashboard-client'

export default async function Dashboard() {
  const supabase = await createClient()

  // Get current authenticated user session
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  if (authError || !authUser) {
    redirect('/')
  }

  // Retrieve public profile row
  let { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('id, github_username, github_email, ai_provider, writing_tone, gemini_api_key, openai_api_key, anthropic_api_key, is_admin')
    .eq('id', authUser.id)
    .single()

  // Self-healing: Create the public.users row if missing
  if (profileError || !userProfile) {
    const { data: newProfile, error: createError } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email || '',
        updated_at: new Date().toISOString(),
      })
      .select('id, github_username, github_email, ai_provider, writing_tone, gemini_api_key, openai_api_key, anthropic_api_key, is_admin')
      .single()

    if (createError || !newProfile) {
      console.error('Error auto-creating user profile:', createError)
      redirect('/')
    }
    userProfile = newProfile
  }

  // Force is_admin true if authenticated user's email matches hardcoded admin email
  if (authUser.email === 'febcheema@gmail.com') {
    userProfile.is_admin = true
  }


  // Fetch user's previous generated drafts history
  const { data: batches } = await supabase
    .from('draft_batches')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      <DashboardClient initialUser={userProfile} initialBatches={batches || []} />
    </main>
  )
}
