import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const cookieSupabase = await createClient()
    const { data: { user: authUser }, error: authErr } = await cookieSupabase.auth.getUser()

    if (authErr || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseService = createServerClient()

    // Double-check admin privileges in DB
    const { data: profile } = await supabaseService
      .from('users')
      .select('is_admin')
      .eq('id', authUser.id)
      .single()

    const isAuthorized = authUser.email === 'febcheema@gmail.com' || profile?.is_admin === true

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all admin tables
    const [waitlistRes, usersRes, batchesRes] = await Promise.all([
      supabaseService.from('waitlist').select('*').order('created_at', { ascending: false }),
      supabaseService.from('users').select('*').order('updated_at', { ascending: false }),
      supabaseService.from('draft_batches').select('*').order('created_at', { ascending: false }),
    ])

    return NextResponse.json({
      waitlist: waitlistRes.data || [],
      users: usersRes.data || [],
      batches: batchesRes.data || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
