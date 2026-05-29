import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { verifySession } from '@/lib/session'
import DashboardClient from './dashboard-client'

export default async function Dashboard() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('user_id')?.value
  const userId = verifySession(sessionCookie)
  if (!userId) redirect('/')

  const supabase = createServerClient()
  const { data: user } = await supabase
    .from('users')
    .select('github_username, github_email, ai_provider, writing_tone')
    .eq('id', userId)
    .single()

  if (!user) redirect('/')

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-neutral-800">
      <DashboardClient initialUser={user} />
    </main>
  )
}
