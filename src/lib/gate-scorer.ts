import Groq from 'groq-sdk';
import type { GateScore, Background } from '@/src/types';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Score a gate task (product teardown) response using AI.
 */
export async function scoreGateTask(
  text: string,
  background: Background | string
): Promise<GateScore> {
  if (!apiKey) throw new Error('AI API key not configured');
  if (!text || text.length < 20) throw new Error('Response too short to score');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `You are a PM hiring expert scoring a candidate's first product teardown.

Candidate background: ${background || 'Not specified'}

The task asked them to pick any app feature and answer:
1. Who is this feature for?
2. What problem does it solve?
3. How would you know if it's working?
4. What would you change — and why?

Their response:
"${text}"

Scoring guide:
- 80–100: Grounds in user + names real problem + proposes measurable change
- 60–79: Shows product instinct but one dimension is weak (no metric, vague user, etc.)
- 40–59: Leads with solution or feature opinion before diagnosing the problem
- 0–39: Too generic or vague to signal PM readiness

Be ruthlessly specific to their actual words. Do not give generic PM feedback.

Return JSON with this exact structure:
{
  "score": 0-100,
  "thinkingStyle": "user-first|metric-first|solution-first|problem-first",
  "headline": "One punchy sentence max 12 words",
  "strength": "One specific thing they did well, referencing their actual words",
  "gap": "One specific gap, referencing their actual words"
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 400,
    response_format: { type: 'json_object' },
  });

  const data = JSON.parse(response.choices[0]?.message?.content || '{}');
  return data as GateScore;
}

export function isGateScoreConfigured(): boolean {
  return Boolean(apiKey);
}
