import { GoogleGenAI, Type } from '@google/genai';
import type { JobMatch, AIReadinessScores, ResumeData, GateScore } from '@/src/types';
import { getCompanyByName, getAllCompanies, getTransitionIntelligence } from '@/src/data/market-data';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Get AI-powered job matches using curated market data.
 * Port of compass-PM/api/job-matches.js.
 */
export async function getAIJobMatches(
  background: string,
  targetCompany: string,
  resumeData: ResumeData | null,
  readinessScores: AIReadinessScores | null,
  gateScore: GateScore | null
): Promise<JobMatch[]> {
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const companies = getAllCompanies();
  const targetMatch = getCompanyByName(targetCompany);
  const otherCompanies = companies.filter(c => c !== targetMatch).slice(0, 6);
  const relevantCompanies = targetMatch ? [targetMatch, ...otherCompanies] : otherCompanies.slice(0, 7);

  const bgMatch = getTransitionIntelligence(background);

  const prompt = `You are a job matching engine for aspiring Product Managers in India.

Given this user's profile AND the real company hiring data below, generate 4 PM job matches. Base your fit scores and gap notes on the ACTUAL hiring bar data provided — do not invent numbers.

## Real Company Hiring Data (from database)
${relevantCompanies.map(c => `
**${c.name}** (${c.stage} · ${c.vertical} · ${c.city})
- Roles: ${c.topRoles.join(', ')}
- Annual PM intake: ${c.annualJuniorPMIntake}
- Hiring bar: Product Sense ${c.hiringBar.productSense}, Analytical ${c.hiringBar.analyticalDepth}, Business ${c.hiringBar.businessFraming}, Technical ${c.hiringBar.technicalCredibility}, AI ${c.hiringBar.aiFluency}, Behavioural ${c.hiringBar.behavioural}
- Interview: ${c.interviewFormat.join(' → ')} (${c.interviewRounds} rounds)
- Switcher-friendly: ${c.switcherFriendly ? 'Yes — ' + c.switcherNote : 'No — ' + c.switcherNote}
- Common rejections: ${c.commonRejectionReasons.join('; ')}
- Recent signals: ${c.recentSignals.join('; ')}
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
- Compare user's readiness scores against the company's hiring bar for each dimension
- Fit % = how many dimensions meet or exceed the hiring bar, weighted by the company's priority dimensions
- If user score is below company bar on 2+ priority dimensions → fit should be under 65%
- Use the transition intelligence to adjust: if this background type converts well at this company, boost fit by 5–10%
- Be specific in gapNote: reference actual dimensions and company-specific context

Return exactly 4 jobs. Put the target company job FIRST. Sort remaining 3 by fit descending.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.4,
      maxOutputTokens: 1000,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                stage: { type: Type.STRING },
                vertical: { type: Type.STRING },
                city: { type: Type.STRING },
                fit: { type: Type.NUMBER },
                isTarget: { type: Type.BOOLEAN },
                gapCount: { type: Type.NUMBER },
                gapNote: { type: Type.STRING },
                salary: { type: Type.STRING },
                interviewRounds: { type: Type.NUMBER },
              },
              required: ['title', 'company', 'fit', 'gapNote', 'salary'],
            },
          },
        },
        required: ['jobs'],
      },
    },
  });

  const data = JSON.parse(response.text || '{"jobs":[]}');
  return data.jobs as JobMatch[];
}

export function isJobMatcherConfigured(): boolean {
  return Boolean(apiKey);
}
