import 'server-only';
import OpenAI from 'openai';
import type { Profile } from '@/lib/types';

const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions, matches the vector column

export function profileText(
  p: Pick<Profile, 'job_title' | 'company' | 'industry' | 'experience_years' | 'skills' | 'bio' | 'networking_goals'>,
) {
  return [
    `Role: ${p.job_title} at ${p.company} (${p.industry}, ${p.experience_years} years)`,
    `Skills: ${p.skills.join(', ')}`,
    `Background: ${p.bio}`,
    `Looking for: ${p.networking_goals}`,
  ].join('\n');
}

/**
 * Writes a short matching summary and an embedding for a profile.
 * Returns null when no API key is configured so profile saves never fail on AI.
 */
export async function summarizeProfile(p: Parameters<typeof profileText>[0]) {
  if (!process.env.OPENAI_API_KEY) return null;
  const openai = new OpenAI();
  const text = profileText(p);

  const [completion, embedding] = await Promise.all([
    openai.chat.completions.create({
      model: process.env.OPENAI_SUMMARY_MODEL || 'gpt-4o-mini',
      max_completion_tokens: 220,
      messages: [
        {
          role: 'system',
          content:
            'You write three-sentence summaries of professionals for an event networking app. Sentence one: who they are. Sentence two: what they are strongest at. Sentence three: who they want to meet. Plain language, no hype, no em dashes.',
        },
        { role: 'user', content: text },
      ],
    }),
    // Embed the structured profile, not the summary, so matching does not depend on generated prose.
    openai.embeddings.create({ model: EMBEDDING_MODEL, input: text }),
  ]);

  return {
    summary: completion.choices[0]?.message?.content?.trim() ?? null,
    embedding: embedding.data[0]?.embedding ?? null,
  };
}
