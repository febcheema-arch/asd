import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const cookieSupabase = await createClient()
    const { data: { user: authUser } } = await cookieSupabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseService = createServerClient()

    const { data: profile } = await supabaseService
      .from('users')
      .select('is_admin')
      .eq('id', authUser.id)
      .single()

    const isAuthorized = authUser.email === 'febcheema@gmail.com' || profile?.is_admin === true

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 })
    }

    const { error: delErr } = await supabaseService
      .from('waitlist')
      .delete()
      .eq('id', id)

    if (delErr) {
      throw delErr
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

