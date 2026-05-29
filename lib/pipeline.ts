import { getLastWeekCommits } from './github'
import { filterCommits } from './filter'
import { generateDraftsWithAI, type AIProvider } from './ai'
import { sendDraftsEmail } from './email'

interface User {
  github_username: string
  github_email: string
  access_token: string
  ai_provider?: string
  writing_tone?: string
}

export async function runPipeline(user: User): Promise<{
  status: 'sent' | 'no_commits' | 'no_drafts' | 'error'
  drafts?: string[]
  error?: string
}> {
  try {
    const commitGroups = await getLastWeekCommits(user.access_token, user.github_username)

    const filtered = commitGroups
      .map(({ repo, commits }) => ({ repo, commits: filterCommits(commits) }))
      .filter(({ commits }) => commits.length > 0)

    if (filtered.length === 0) return { status: 'no_commits' }

    const provider = (user.ai_provider || process.env.DEFAULT_AI_PROVIDER || 'anthropic') as AIProvider
    const tone = user.writing_tone || 'default'
    const drafts = await generateDraftsWithAI(filtered, provider, tone)
    if (drafts.length === 0) return { status: 'no_drafts' }

    console.log('\n====================================')
    console.log(`📝 GENERATED TWEET DRAFTS FOR @${user.github_username}:`)
    drafts.forEach((d, i) => console.log(`${i + 1}. ${d}`))
    console.log('====================================\n')

    await sendDraftsEmail(user.github_email, user.github_username, drafts)
    return { status: 'sent', drafts }
  } catch (err) {
    return { status: 'error', error: String(err) }
  }
}
