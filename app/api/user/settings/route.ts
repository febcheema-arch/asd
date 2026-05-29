import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifySession } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('user_id')?.value
    const userId = verifySession(sessionCookie)
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { ai_provider, writing_tone } = await req.json()

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('users')
      .update({
        ai_provider: ai_provider || null,
        writing_tone: writing_tone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data })
  } catch (err) {
    console.error('Unexpected settings error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
