import Groq from 'groq-sdk';
import type { NorthContext } from '@/src/types';
import { getCompanyByName, getTransitionIntelligence } from '@/src/data/market-data';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Build context string from user data for North's prompt.
 */
export function buildNorthContext(ctx: NorthContext): string {
  const lines = [
    `Name: ${ctx.name || 'User'}`,
    `Background: ${ctx.background || 'Not specified'}`,
    `Target company: ${ctx.targetCompany || 'Not specified'}`,
    `Current role: ${ctx.currentRole || 'Not specified'}`,
    `Experience: ${ctx.totalExperience || 'Not specified'}`,
    ctx.readinessOverall != null ? `Readiness score: ${ctx.readinessOverall}/100` : '',
    ctx.gateScore ? `Gate task: ${ctx.gateScore.score}/100 — ${ctx.gateScore.headline}\nStrength: ${ctx.gateScore.strength}\nGap: ${ctx.gateScore.gap}` : '',
  ].filter(Boolean);

  if (ctx.aiDimensions.length > 0) {
    lines.push('Dimension scores:');
    ctx.aiDimensions.forEach(d => lines.push(`  ${d.name}: ${d.score}/100 (${d.status})`));
  }

  if (ctx.resumeHighlights.length > 0) {
    const strengths = ctx.resumeHighlights.filter(h => h.type === 'strength').map(h => h.text);
    const warnings = ctx.resumeHighlights.filter(h => h.type === 'warning').map(h => h.text);
    if (strengths.length) lines.push(`Resume strengths: ${strengths.join('; ')}`);
    if (warnings.length) lines.push(`Resume warnings: ${warnings.join('; ')}`);
  }

  return lines.join('\n');
}

/**
 * Keyword-based RAG fallback: match target company from JSON.
 */
function keywordRAG(context: string): string {
  const targetLine = context.split('\n').find(l => l.startsWith('Target company:'));
  const targetName = targetLine ? targetLine.replace('Target company:', '').trim() : '';

  let ragContext = '';

  if (targetName && targetName !== 'Not specified') {
    const match = getCompanyByName(targetName);
    if (match) {
      ragContext += `\n\n## Target Company Intelligence — ${match.name} (from keyword match)\n` +
        `- Hiring bar: Product Sense ${match.hiringBar.productSense}, Analytical ${match.hiringBar.analyticalDepth}, Business ${match.hiringBar.businessFraming}, Technical ${match.hiringBar.technicalCredibility}, AI ${match.hiringBar.aiFluency}\n` +
        `- Interview: ${match.interviewFormat.join(' → ')} (${match.interviewRounds} rounds)\n` +
        `- Common rejections: ${match.commonRejectionReasons.join('; ')}\n` +
        `- Recent signals: ${match.recentSignals.join('; ')}\n` +
        `- Switcher note: ${match.switcherNote}\n` +
        `- Salary: ${match.salaryRange}`;
    }
  }

  const bgLine = context.split('\n').find(l => l.startsWith('Background:'));
  const bgName = bgLine ? bgLine.replace('Background:', '').trim() : '';
  if (bgName) {
    const bgMatch = getTransitionIntelligence(bgName);
    if (bgMatch) {
      ragContext += `\nTransition intelligence for ${bgMatch.background}s: ${bgMatch.conversionRate} conversion rate, avg ${bgMatch.avgTimeToOffer} to offer. Best fit: ${bgMatch.bestFitCompanies.join(', ')}. ${bgMatch.note}`;
    }
  }

  return ragContext;
}

/**
 * Send a message to North and get a reply.
 */
export async function askNorth(
  message: string,
  context: NorthContext
): Promise<{ reply: string; ragSource: string }> {
  if (!apiKey) throw new Error('AI API key not configured');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  const contextStr = buildNorthContext(context);
  const ragContext = keywordRAG(contextStr);

  const prompt = `You are North, an AI guide inside a PM career navigation platform.

Your personality:
- Honest and direct. Not a cheerleader. Never say "great question!"
- Specific to this user's actual data — never generic PM advice
- Concise: 2–4 sentences max per response
- Give signal and next action, not motivation
- Reference the user's actual background, score, and gaps when relevant
- When discussing companies, interview prep, or job market — use the real data provided below, not generic advice
- Address the user by their first name naturally (not every message, but regularly)
- If you don't have enough context to be specific, ask a clarifying question

User context:
${contextStr}${ragContext}

User message: "${message}"

Reply as North. Plain conversational English. No bullet points. No markdown. No filler pleasantries. Just honest, specific, personalized signal.`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
  });

  const reply = response.choices[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response. Try again.";
  return { reply, ragSource: ragContext ? 'keyword' : 'none' };
}

export function isNorthConfigured(): boolean {
  return Boolean(apiKey);
}
