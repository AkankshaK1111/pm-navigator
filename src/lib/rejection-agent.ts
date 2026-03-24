import { GoogleGenAI, Type } from '@google/genai';
import type { RejectionDiagnosis, ResumeData, GateScore, AIReadinessScores } from '@/src/types';
import { getCompanyByName } from '@/src/data/market-data';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Step 1: IDENTIFY — extract company name and round from user message.
 */
async function identifyCompany(
  ai: GoogleGenAI,
  message: string
): Promise<{ company: string; round: string }> {
  const prompt = `Extract the company name and interview round from this message. Only return a company if the user EXPLICITLY names one in their message. Do NOT assume or fill in a company they did not mention.

User message: "${message || 'I got rejected'}"

Return JSON: { "company": "<company name ONLY if explicitly mentioned, otherwise 'unknown'>", "round": "<specific round like 'case study' or 'analytical' or 'unknown'>" }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 200,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            round: { type: Type.STRING },
          },
          required: ['company', 'round'],
        },
      },
    });
    return JSON.parse(response.text || '{"company":"unknown","round":"unknown"}');
  } catch {
    return { company: 'unknown', round: 'unknown' };
  }
}

/**
 * Step 2: RETRIEVE — get company data via keyword match from JSON.
 */
function retrieveCompanyData(companyName: string): { data: string | null; ragSource: string } {
  if (!companyName || companyName === 'unknown') {
    return { data: null, ragSource: 'none' };
  }

  const match = getCompanyByName(companyName);
  if (!match) return { data: null, ragSource: 'none' };

  const data = `${match.name} (${match.stage}, ${match.vertical}, ${match.city})
Hiring bar: Product Sense ${match.hiringBar.productSense}, Analytical Depth ${match.hiringBar.analyticalDepth}, Business Framing ${match.hiringBar.businessFraming}, Technical Credibility ${match.hiringBar.technicalCredibility}, AI Fluency ${match.hiringBar.aiFluency}, Behavioural ${match.hiringBar.behavioural}
Interview: ${match.interviewFormat.join(' → ')} (${match.interviewRounds} rounds)
Common rejections: ${match.commonRejectionReasons.join('; ')}
Recent signals: ${match.recentSignals.join('; ')}
Switcher note: ${match.switcherNote}`;

  return { data, ragSource: 'keyword' };
}

/**
 * Steps 3 & 4: DIAGNOSE + GENERATE — single prompt for diagnosis and 2-week plan.
 */
export async function runRejectionAgent(
  message: string,
  background: string,
  targetCompany: string,
  resumeData: ResumeData | null,
  gateScore: GateScore | null,
  readinessScores: AIReadinessScores | null
): Promise<{ diagnosis: RejectionDiagnosis | null; needsInfo: boolean; question?: string }> {
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  // Step 1: Identify company
  const identified = await identifyCompany(ai, message);

  if (!identified.company || identified.company === 'unknown') {
    return {
      diagnosis: null,
      needsInfo: true,
      question: "Which company rejected you? And do you know which round — was it the case study, analytics, behavioural, or something else?",
    };
  }

  // Step 2: Retrieve company data
  const { data: companyData, ragSource } = retrieveCompanyData(identified.company);

  // Build user scores string
  const userScores = readinessScores?.dimensions
    ? readinessScores.dimensions.map(d => `${d.name}: ${d.score}/100 (${d.status})`).join('\n')
    : 'No readiness scores available';

  // Steps 3 & 4: Diagnose + Generate plan
  const prompt = `You are Compass's Post-Rejection Remediation Agent. A user just told you they got rejected. Your job is to diagnose WHY and build a recovery plan.

## What Happened
User message: "${message || 'I got rejected'}"
Company: ${identified.company}
Round: ${identified.round}

## Company Intelligence (Retrieved)
${companyData || 'No company data available — provide general guidance'}

## User Profile
Background: ${background || 'Not provided'}
Target company: ${targetCompany || 'Not specified'}
Current role: ${resumeData?.currentRole || 'Not provided'}
Experience: ${resumeData?.totalExperience || 'Not provided'}
Skills: ${resumeData?.skills ? resumeData.skills.join(', ') : 'Not provided'}

Gate task: ${gateScore ? `${gateScore.score}/100 — ${gateScore.headline}` : 'Not completed'}

## User's Readiness Scores
${userScores}

## Your Task

**Step 1 — Diagnose:** Compare the user's scores against the company's hiring bar. Identify which dimensions caused the rejection. Be specific — reference actual numbers.

**Step 2 — Plan:** Create a 2-week day-by-day remediation plan that targets the 2-3 weakest dimensions relative to this company's bar. Each day should have one concrete exercise (not "read about X" — actual practice tasks with deliverables).

## Rules
- Be honest and direct. This person just got rejected — they need signal, not sympathy.
- Every claim must reference actual data (their score vs company bar).
- The plan must be actionable — each day has a specific task with a clear output.
- If you don't know the company or round, focus on their weakest dimensions overall.
- Week 1 should focus on the biggest gap. Week 2 on the second gap + integration.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 2500,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          round: { type: Type.STRING },
          headline: { type: Type.STRING, description: 'One hard-hitting sentence — what went wrong' },
          rootCause: {
            type: Type.OBJECT,
            properties: {
              primary: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  userScore: { type: Type.NUMBER },
                  companyBar: { type: Type.NUMBER },
                  gap: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ['dimension', 'userScore', 'companyBar', 'gap', 'explanation'],
              },
              secondary: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  userScore: { type: Type.NUMBER },
                  companyBar: { type: Type.NUMBER },
                  gap: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ['dimension', 'userScore', 'companyBar', 'gap', 'explanation'],
              },
            },
            required: ['primary', 'secondary'],
          },
          recoveryPlan: {
            type: Type.OBJECT,
            properties: {
              duration: { type: Type.STRING },
              focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              weeks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.NUMBER },
                    theme: { type: Type.STRING },
                    days: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          day: { type: Type.NUMBER },
                          task: { type: Type.STRING },
                          output: { type: Type.STRING },
                          time: { type: Type.STRING },
                        },
                        required: ['day', 'task', 'output', 'time'],
                      },
                    },
                  },
                  required: ['week', 'theme', 'days'],
                },
              },
            },
            required: ['duration', 'focusAreas', 'weeks'],
          },
          reapplySignal: { type: Type.STRING },
        },
        required: ['company', 'round', 'headline', 'rootCause', 'recoveryPlan', 'reapplySignal'],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}') as RejectionDiagnosis;
  parsed.ragSource = ragSource;

  return { diagnosis: parsed, needsInfo: false };
}

export function isRejectionAgentConfigured(): boolean {
  return Boolean(apiKey);
}
