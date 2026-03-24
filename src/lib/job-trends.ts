import Groq from 'groq-sdk';
import type { TrendSignal, AIReadinessScores } from '@/src/types';
import { getCompanyByName, getMarketTrends } from '@/src/data/market-data';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Get personalized trend signals using market data + user context.
 */
export async function getPersonalizedTrends(
  background: string,
  targetCompany: string,
  readinessScores: AIReadinessScores | null
): Promise<TrendSignal[]> {
  if (!apiKey) throw new Error('AI API key not configured');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  const trends = getMarketTrends();
  const targetMatch = getCompanyByName(targetCompany);

  const gaps = (readinessScores?.dimensions || [])
    .filter(d => d.score < 60)
    .map(d => d.name)
    .join(', ');

  const prompt = `You are a market intelligence engine. Generate 4 personalized hiring trend signals for this aspiring PM.

## Real Market Trend Data (from database)
${trends.map(t => `- [${t.impact.toUpperCase()}] ${t.trend}: ${t.detail} (Source: ${t.source})`).join('\n')}

## Target Company Intelligence
${targetMatch ? `${targetMatch.name} (${targetMatch.stage} · ${targetMatch.vertical} · ${targetMatch.city})
- Recent signals: ${targetMatch.recentSignals.join('; ')}
- Hiring: ${targetMatch.annualJuniorPMIntake} junior PMs/year
- Top roles: ${targetMatch.topRoles.join(', ')}
- Switcher-friendly: ${targetMatch.switcherFriendly ? 'Yes' : 'No'}` : 'No specific target company data available'}

## User Context
Background: ${background || 'Not provided'}
Target company: ${targetCompany || 'Not specified'}
Dimension gaps: ${gaps || 'None identified'}

## Rules
- Each signal must reference REAL data from the database above — do not invent statistics
- Make signals personally relevant to THIS user's background, target company, and gaps
- Keep each signal to 1–2 sentences max
- Reference specific companies, numbers, and dimensions from the data

Return exactly 4 signals as JSON:
{
  "signals": [
    {"text": "Signal text referencing real data", "impact": "positive|warning|neutral|negative"},
    ...
  ]
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  const data = JSON.parse(response.choices[0]?.message?.content || '{"signals":[]}');
  return data.signals as TrendSignal[];
}

export function isTrendsConfigured(): boolean {
  return Boolean(apiKey);
}
