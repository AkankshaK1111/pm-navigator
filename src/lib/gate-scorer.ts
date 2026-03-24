import { GoogleGenAI, Type } from '@google/genai';
import type { GateScore, Background } from '@/src/types';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Score a gate task (product teardown) response using AI.
 * Port of compass-PM/api/score-gate.js → @google/genai SDK.
 */
export async function scoreGateTask(
  text: string,
  background: Background | string
): Promise<GateScore> {
  if (!apiKey) throw new Error('Gemini API key not configured');
  if (!text || text.length < 20) throw new Error('Response too short to score');

  const ai = new GoogleGenAI({ apiKey });

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

Be ruthlessly specific to their actual words. Do not give generic PM feedback.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: 'Integer 0–100' },
          thinkingStyle: {
            type: Type.STRING,
            description: 'One of: user-first, metric-first, solution-first, problem-first',
          },
          headline: {
            type: Type.STRING,
            description: 'One punchy sentence max 12 words that captures how this person thinks',
          },
          strength: {
            type: Type.STRING,
            description: 'One specific thing they did well, referencing their actual words',
          },
          gap: {
            type: Type.STRING,
            description: 'One specific gap or reframe needed, referencing their actual words',
          },
        },
        required: ['score', 'thinkingStyle', 'headline', 'strength', 'gap'],
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  return data as GateScore;
}

export function isGateScoreConfigured(): boolean {
  return Boolean(apiKey);
}
