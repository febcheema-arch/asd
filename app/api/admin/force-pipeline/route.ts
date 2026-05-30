import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/supabase-server'
import { runPipeline } from '@/lib/pipeline'

export async function POST(req: Request) {
  try {
    const cookieSupabase = await createClient()
    const { data: { user: authUser }, error: authErr } = await cookieSupabase.auth.getUser()

    if (authErr || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseService = createServerClient()

    // Double-check admin privileges in DB using service role client
    const { data: profile } = await supabaseService
      .from('users')
      .select('is_admin, email')
      .eq('id', authUser.id)
      .single()

    const isAuthorized = authUser.email === 'febcheema@gmail.com' || profile?.is_admin === true

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get target user ID to force run
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    // Fetch target user settings and tokens
    const { data: targetUser, error: fetchErr } = await supabaseService
      .from('users')
      .select('id, github_username, github_email, access_token, ai_provider, writing_tone, gemini_api_key, openai_api_key, anthropic_api_key')
      .eq('id', userId)
      .single()

    if (fetchErr || !targetUser) {
      return NextResponse.json({ error: 'Target user not found or profile incomplete' }, { status: 404 })
    }

    if (!targetUser.github_username || !targetUser.access_token) {
      return NextResponse.json({ error: 'Target user has not connected their GitHub account' }, { status: 400 })
    }

    // Run the pipeline
    const pipelineResult = await runPipeline(targetUser)

    return NextResponse.json({ success: true, result: pipelineResult })
  } catch (err: any) {
    console.error('Error running manual admin force-pipeline:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

