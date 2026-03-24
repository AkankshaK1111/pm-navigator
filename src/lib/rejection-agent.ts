import Groq from 'groq-sdk';
import type { RejectionDiagnosis, ResumeData, GateScore, AIReadinessScores } from '@/src/types';
import { getCompanyByName } from '@/src/data/market-data';

const apiKey = process.env.GROQ_API_KEY;

/**
 * Step 1: IDENTIFY — extract company name and round from user message.
 */
async function identifyCompany(
  client: Groq,
  message: string
): Promise<{ company: string; round: string }> {
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Extract the company name and interview round from this message. Only return a company if the user EXPLICITLY names one. Do NOT assume.

User message: "${message || 'I got rejected'}"

Return JSON: {"company": "<company or 'unknown'>", "round": "<round or 'unknown'>"}`,
      }],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0]?.message?.content || '{"company":"unknown","round":"unknown"}');
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
 * Steps 3 & 4: DIAGNOSE + GENERATE — diagnosis and 2-week plan.
 */
export async function runRejectionAgent(
  message: string,
  background: string,
  targetCompany: string,
  resumeData: ResumeData | null,
  gateScore: GateScore | null,
  readinessScores: AIReadinessScores | null
): Promise<{ diagnosis: RejectionDiagnosis | null; needsInfo: boolean; question?: string }> {
  if (!apiKey) throw new Error('AI API key not configured');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  // Step 1: Identify company
  const identified = await identifyCompany(client, message);

  if (!identified.company || identified.company === 'unknown') {
    return {
      diagnosis: null,
      needsInfo: true,
      question: "Which company rejected you? And do you know which round — was it the case study, analytics, behavioural, or something else?",
    };
  }

  // Step 2: Retrieve company data
  const { data: companyData, ragSource } = retrieveCompanyData(identified.company);

  const userScores = readinessScores?.dimensions
    ? readinessScores.dimensions.map(d => `${d.name}: ${d.score}/100 (${d.status})`).join('\n')
    : 'No readiness scores available';

  // Steps 3 & 4: Diagnose + Generate plan
  const prompt = `You are a Post-Rejection Remediation Agent. A user got rejected. Diagnose WHY and build a recovery plan.

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
**Step 1 — Diagnose:** Compare user scores against company hiring bar. Identify which dimensions caused the rejection with actual numbers.
**Step 2 — Plan:** Create a 2-week day-by-day plan targeting 2-3 weakest dimensions. Each day: one concrete exercise with deliverable.

## Rules
- Be honest and direct — they need signal, not sympathy.
- Reference actual data (score vs company bar).
- Each day must have a specific task with clear output.
- Week 1: biggest gap. Week 2: second gap + integration.

Return JSON:
{
  "company": "company name",
  "round": "round or General",
  "headline": "one hard-hitting sentence",
  "rootCause": {
    "primary": {"dimension": "name", "userScore": 0, "companyBar": 0, "gap": 0, "explanation": "one sentence"},
    "secondary": {"dimension": "name", "userScore": 0, "companyBar": 0, "gap": 0, "explanation": "one sentence"}
  },
  "recoveryPlan": {
    "duration": "2 weeks",
    "focusAreas": ["dim1", "dim2"],
    "weeks": [
      {
        "week": 1,
        "theme": "what this week targets",
        "days": [
          {"day": 1, "task": "specific exercise", "output": "what they produce", "time": "estimated minutes"},
          {"day": 2, "task": "...", "output": "...", "time": "..."},
          {"day": 3, "task": "...", "output": "...", "time": "..."},
          {"day": 4, "task": "...", "output": "...", "time": "..."},
          {"day": 5, "task": "...", "output": "...", "time": "..."}
        ]
      },
      {
        "week": 2,
        "theme": "...",
        "days": [
          {"day": 1, "task": "...", "output": "...", "time": "..."},
          {"day": 2, "task": "...", "output": "...", "time": "..."},
          {"day": 3, "task": "...", "output": "...", "time": "..."},
          {"day": 4, "task": "...", "output": "...", "time": "..."},
          {"day": 5, "task": "...", "output": "...", "time": "..."}
        ]
      }
    ]
  },
  "reapplySignal": "one sentence — when to try again and what score to hit"
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const parsed = JSON.parse(response.choices[0]?.message?.content || '{}') as RejectionDiagnosis;
  parsed.ragSource = ragSource;

  return { diagnosis: parsed, needsInfo: false };
}

export function isRejectionAgentConfigured(): boolean {
  return Boolean(apiKey);
}
