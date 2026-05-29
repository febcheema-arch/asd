import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { GoogleGenAI } from '@google/genai'
import type { Commit } from './filter'

export type AIProvider = 'anthropic' | 'openai' | 'gemini'

function parseTweets(text: string): string[] {
  if (!text) return []
  return text
    .split('\n')
    .filter(line => /^\d+[\.\-\)]/.test(line.trim()))
    .map(line => line.replace(/^\d+[\.\-\)]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
}

export async function generateDraftsWithAI(
  commitGroups: { repo: string; commits: Commit[] }[],
  provider: AIProvider = 'anthropic',
  tone: string = 'default'
): Promise<string[]> {
  const commitSummary = commitGroups
    .flatMap(({ repo, commits }) =>
      commits.map(c => {
        const msg = c.message.split('\n')[0]
        return `[${repo}] ${msg} (+${c.additions}/-${c.deletions} lines, ${c.filesChanged.length} files)`
      })
    )
    .join('\n')

  let toneGuidance = "Write in a direct builder's voice. Under 280 characters. No hashtags. No emojis unless the founder uses them. Sound like a person, not a press release."
  
  if (tone === 'sarcastic') {
    toneGuidance = "Write in a funny, slightly sarcastic developer voice. Roast common startup hacks or developer struggles, but show that you shipped something solid. Under 280 characters. No hashtags. No emojis."
  } else if (tone === 'technical') {
    toneGuidance = "Write in a highly technical, educational developer voice focusing on architectural details, code structures, and concrete facts. Sound like a helpful senior engineer. Under 280 characters. No hashtags. No emojis."
  } else if (tone === 'hype') {
    toneGuidance = "Write in an energetic, excited founder voice. High energy, celebratory, highlighting velocity and execution. Under 280 characters. No hashtags."
  }

  const prompt = `You are a ghostwriter for a technical founder. Here are the commits they shipped this week:

${commitSummary}

${toneGuidance}

Return ONLY the 5 tweets, numbered 1-5, one per line. No preamble, no explanation.`

  try {
    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        })
        const text = completion.choices[0]?.message?.content || ''
        return parseTweets(text)
      }

      case 'gemini': {
        // Fallback or explicit key initialization
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })
        const text = response.text || ''
        return parseTweets(text)
      }

      case 'anthropic':
      default: {
        const client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        })
        const message = await client.messages.create({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        })
        if (!message.content || message.content.length === 0) return []
        const content = message.content[0]
        if (content.type !== 'text') return []
        return parseTweets(content.text)
      }
    }
  } catch (err) {
    console.error(`Error generating drafts with provider ${provider}:`, err)
    throw err
  }
}
