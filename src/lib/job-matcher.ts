import Groq from 'groq-sdk';
import type { JobMatch, AIReadinessScores, ResumeData, GateScore } from '@/src/types';
import { getCompanyByName, getAllCompanies, getTransitionIntelligence } from '@/src/data/market-data';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Get AI-powered job matches using curated market data.
 */
export async function getAIJobMatches(
  background: string,
  targetCompany: string,
  resumeData: ResumeData | null,
  readinessScores: AIReadinessScores | null,
  gateScore: GateScore | null
): Promise<JobMatch[]> {
  if (!apiKey) throw new Error('AI API key not configured');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const companies = getAllCompanies();
  const targetMatch = getCompanyByName(targetCompany);
  const otherCompanies = companies.filter(c => c !== targetMatch).slice(0, 6);
  const relevantCompanies = targetMatch ? [targetMatch, ...otherCompanies] : otherCompanies.slice(0, 7);

  const bgMatch = getTransitionIntelligence(background);

  const prompt = `You are a job matching engine for aspiring Product Managers in India.

Given this user's profile AND the real company hiring data below, generate 4 PM job matches. Base your fit scores and gap notes on the ACTUAL hiring bar data — do not invent numbers.

## Real Company Hiring Data (from database)
${relevantCompanies.map(c => `
**${c.name}** (${c.stage} · ${c.vertical} · ${c.city})
- Roles: ${c.topRoles.join(', ')}
- Annual PM intake: ${c.annualJuniorPMIntake}
- Hiring bar: Product Sense ${c.hiringBar.productSense}, Analytical ${c.hiringBar.analyticalDepth}, Business ${c.hiringBar.businessFraming}, Technical ${c.hiringBar.technicalCredibility}, AI ${c.hiringBar.aiFluency}, Behavioural ${c.hiringBar.behavioural}
- Interview: ${c.interviewFormat.join(' → ')} (${c.interviewRounds} rounds)
- Switcher-friendly: ${c.switcherFriendly ? 'Yes — ' + c.switcherNote : 'No — ' + c.switcherNote}
- Common rejections: ${c.commonRejectionReasons.join('; ')}
- Salary: ${c.salaryRange}`).join('\n')}

${bgMatch ? `\n## Transition Intelligence for ${bgMatch.background}s\n- Conversion rate: ${bgMatch.conversionRate}\n- Avg time to offer: ${bgMatch.avgTimeToOffer}\n- Best fit companies: ${bgMatch.bestFitCompanies.join(', ')}\n- Note: ${bgMatch.note}` : ''}

## User Profile
Background: ${background || 'Not provided'}
Target company: ${targetCompany || 'Not specified'}
Current role: ${resumeData?.currentRole || 'Not provided'}
Experience: ${resumeData?.totalExperience || 'Not provided'}
Skills: ${resumeData?.skills ? resumeData.skills.join(', ') : 'Not provided'}

Readiness scores:
${readinessScores?.dimensions ? readinessScores.dimensions.map(d => `${d.name}: ${d.score}/100 (${d.status})`).join('\n') : 'Not yet scored'}

Gate task:
${gateScore ? `Score: ${gateScore.score}/100 — ${gateScore.headline}` : 'Not completed'}

## Fit Score Rules
- Compare user's readiness scores against company hiring bar per dimension
- Fit % = how many dimensions meet or exceed hiring bar, weighted by priority
- Below bar on 2+ priority dimensions → fit under 65%
- Use transition intelligence to adjust: +5–10% if background converts well at this company

Return exactly 4 jobs. Target company job FIRST. Sort remaining 3 by fit descending.

Return JSON with this exact structure:
{
  "jobs": [
    {
      "title": "Role title",
      "company": "Company name",
      "stage": "Stage",
      "vertical": "Vertical",
      "city": "City",
      "fit": 0-100,
      "isTarget": true/false,
      "gapCount": 0-6,
      "gapNote": "Specific gap note referencing dimensions",
      "salary": "Salary range",
      "interviewRounds": 3-5
    }
  ]
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const data = JSON.parse(response.choices[0]?.message?.content || '{"jobs":[]}');
  return data.jobs as JobMatch[];
}

export function isJobMatcherConfigured(): boolean {
  return Boolean(apiKey);
}
