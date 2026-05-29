import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { runPipeline } from '@/lib/pipeline'
import { verifySession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('user_id')?.value
  const userId = verifySession(sessionCookie)
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('github_username, github_email, access_token, ai_provider, writing_tone')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const result = await runPipeline(user)
  return NextResponse.json(result)
}
