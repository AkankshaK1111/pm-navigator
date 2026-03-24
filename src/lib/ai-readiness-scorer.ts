import { GoogleGenAI, Type } from '@google/genai';
import type { AIReadinessScores, ResumeData, GateScore } from '@/src/types';

const apiKey = process.env.GEMINI_API_KEY;

/**
 * AI-driven 6-dimension readiness scoring.
 * Port of compass-PM/api/score-readiness.js — the calibrated prompt with
 * background baselines, cross-validation rules, calibration examples,
 * and weighted scoring formula.
 */
export async function scoreReadinessWithAI(
  background: string,
  targetCompany: string,
  resumeData: ResumeData | null,
  gateScore: GateScore | null
): Promise<AIReadinessScores> {
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a PM readiness assessor for a career navigation platform for aspiring product managers.

Score this user across 6 PM dimensions on a 0–100 scale. Be honest and calibrated — most aspiring PMs score 30–65. Only give 80+ for genuinely strong, direct evidence. Never inflate.

---

## The 6 Dimensions — What to Look For

### 1. Product Sense (user empathy, problem framing, prioritisation)
**Evidence signals:**
- GATE TASK: Did they start with a user problem or jump to a solution? Did they explain *who* is affected and *why* it matters? Did they prioritise what to fix first?
- RESUME: Product roles, user research, design collaboration, feature launches, customer-facing work, A/B test-driven feature decisions
- BACKGROUND: Design, UX, customer support, or front-end backgrounds show natural user empathy. Pure backend or data roles show weaker signal here.
**Cross-check:** If gate score is below 40, Product Sense cannot exceed 55 — the gate task is a live product thinking sample.

### 2. Analytical Depth (metric reasoning, data-driven decisions, quantitative rigour)
**Evidence signals:**
- GATE TASK: Did they reference a metric, conversion rate, or measurable outcome? Did they reason about *how much* impact their suggestion would have?
- RESUME: Data analysis, SQL, Python/R for analytics, A/B testing, dashboards, reporting, "increased X by Y%" type results, analytics tools (Mixpanel, Amplitude, Tableau)
- BACKGROUND: Data science, analytics, finance, or engineering backgrounds start higher. Marketing or design backgrounds start lower unless resume shows data work.
**Cross-check:** If resume shows no quantitative results or metrics and gate task had no metric reasoning, cap at 45.

### 3. Business Framing (commercial awareness, market thinking, revenue/growth)
**Evidence signals:**
- GATE TASK: Did they mention business impact, revenue, market positioning, or competitive dynamics?
- RESUME: P&L ownership, revenue targets, pricing work, market analysis, strategy roles, consulting projects, MBA coursework, business development, GTM
- BACKGROUND: MBA, consulting, business analyst, or sales backgrounds start higher. Engineering backgrounds start lower unless resume shows business exposure.
**Cross-check:** Pure technical backgrounds with no business language in resume or gate task should score 25–40.

### 4. Technical Credibility (engineering fluency, system thinking, technical communication)
**Evidence signals:**
- RESUME: Engineering roles, CS degree, system design, API work, architecture decisions, technical leadership, code reviews, DevOps, infrastructure
- BACKGROUND: Software engineer, data engineer, ML engineer backgrounds score 70–85 by default. Non-technical backgrounds need strong resume evidence to exceed 45.
- GATE TASK: Did they reference technical feasibility, implementation complexity, or engineering tradeoffs?
**Cross-check:** If background is "Software / Data Engineer" and resume confirms 2+ years in technical roles, floor is 65.

### 5. AI Fluency (AI/ML understanding, AI product thinking, applied AI)
**Evidence signals:**
- RESUME: ML projects, AI tools used (ChatGPT, Copilot, Midjourney in workflow), AI/ML coursework, LLM experience, data pipelines for ML, prompt engineering, AI product features shipped
- GATE TASK: Did they mention AI as part of their teardown? Did they think about AI-native solutions?
- BACKGROUND: ML engineers and data scientists start at 50–65. Others start at 20–35 unless resume shows specific AI work.
**Cross-check:** Mentioning ChatGPT as a user is worth 5–10 points max. Building or shipping AI features is worth 30–50 points. Don't conflate using AI tools with understanding AI products.

### 6. Behavioural (leadership, collaboration, conflict resolution, PM-style delivery)
**Evidence signals:**
- RESUME: Led cross-functional teams, managed stakeholders, resolved conflicts, mentored juniors, drove alignment across teams, shipped under ambiguity, presented to leadership
- BACKGROUND: Consulting, program management, team lead, or founder backgrounds start higher. Individual contributor roles need resume evidence of collaboration.
- GATE TASK: Did they frame their argument persuasively? Did they consider multiple stakeholders?
**Cross-check:** If resume shows only individual contributor work with no team/leadership language, cap at 50.

---

## Background-Type Baselines
Use these as starting points, then adjust up or down based on actual resume evidence:

| Background | Product Sense | Analytical | Business | Technical | AI Fluency | Behavioural |
|---|---|---|---|---|---|---|
| Software / Data Engineer | 35–45 | 50–60 | 25–35 | 70–85 | 30–45 | 35–45 |
| Business / Strategy / Consulting | 40–50 | 45–55 | 55–70 | 20–35 | 20–30 | 50–65 |
| Design / UX | 55–65 | 30–40 | 30–40 | 25–35 | 20–30 | 40–50 |
| Data Science / Analytics | 35–45 | 65–80 | 35–45 | 50–60 | 45–60 | 30–40 |
| Marketing / Growth | 45–55 | 40–50 | 50–60 | 20–30 | 25–35 | 40–50 |
| MBA (no prior tech) | 40–50 | 45–55 | 55–65 | 20–30 | 20–30 | 50–60 |
| CS / Engineering Student | 30–40 | 40–50 | 20–30 | 55–70 | 30–45 | 25–35 |

These are baselines for someone with NO other evidence. Resume data and gate task should move scores up or down from these ranges.

---

## Scoring Bands
- 0–30: No evidence whatsoever. Nothing in resume, gate task, or background maps to this dimension.
- 31–50: Early signals — some adjacent experience but no direct PM-relevant proof. Significant gaps.
- 51–65: Developing — real foundations visible in resume or gate task, but needs targeted work to be interview-ready.
- 66–80: Solid — clear, direct evidence. Above average for aspiring PMs. Would pass a screening round on this dimension.
- 81–100: Exceptional — rare. Multiple strong signals across resume AND gate task. Only for someone who could credibly interview at a top company on this dimension alone.

---

## Calibration Examples

**Example A — Backend Engineer, 3 years, gate score 52:**
Product Sense: 42 (gate task showed some user thinking but led with solution), Analytical: 55 (resume has SQL + dashboards), Business: 28 (no business exposure), Technical: 78 (3 years backend, system design), AI Fluency: 32 (uses Copilot, no AI product work), Behavioural: 38 (IC role, no leadership signals). Overall: 46.

**Example B — Management Consultant, 4 years, MBA, gate score 68:**
Product Sense: 55 (gate task framed user problem well), Analytical: 58 (case work + MBA quant), Business: 72 (strategy projects, P&L exposure), Technical: 25 (no technical background), AI Fluency: 22 (no AI signals), Behavioural: 65 (led client teams, stakeholder management). Overall: 50.

**Example C — Data Scientist, 2 years, gate score 45:**
Product Sense: 38 (gate task was metric-heavy but missed the user), Analytical: 72 (strong data + ML pipeline work), Business: 35 (no business framing), Technical: 62 (Python, SQL, ML infrastructure), AI Fluency: 58 (built ML models, understands AI product implications), Behavioural: 32 (solo IC work). Overall: 50.

---

## Overall Score Calculation
Weighted average with these weights:
- Product Sense: 25% (most important — this is what PM interviews test hardest)
- Analytical Depth: 20%
- Business Framing: 15%
- Technical Credibility: 15%
- AI Fluency: 10%
- Behavioural: 15%

---

## Critical Rules
1. You can ONLY score based on evidence present in the data below. No assumptions, no generous interpretation.
2. If a dimension has zero evidence, score it 15–25 — not 0 (everyone has some baseline) but not 30+ (that requires real signals).
3. The gate task is a LIVE SAMPLE of thinking. It is stronger evidence than resume claims for Product Sense and Analytical Depth.
4. Resume job titles are weaker evidence than described accomplishments. "Software Engineer at Google" alone is worth less than "Built internal tool that reduced deploy time by 40% across 3 teams."
5. Most career switchers should have 2–3 dimensions in the 30–50 range. If all 6 are above 50, you are likely inflating.
6. The note for each dimension MUST reference specific evidence from the user's data — never generic advice.

---

## User Data
Background: ${background || 'Not provided'}
Target company: ${targetCompany || 'Not specified'}

Resume data:
${resumeData ? JSON.stringify(resumeData, null, 2) : 'No resume uploaded'}

Gate task result:
${gateScore ? `Score: ${gateScore.score}/100\nHeadline: ${gateScore.headline}\nStrength: ${gateScore.strength}\nGap: ${gateScore.gap}` : 'No gate task completed'}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 1200,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dimensions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Dimension name (Product Sense, Analytical Depth, Business Framing, Technical Credibility, AI Fluency, Behavioural)' },
                score: { type: Type.NUMBER, description: '0-100 score' },
                status: { type: Type.STRING, description: 'Gap, Developing, Solid, or Strong' },
                note: { type: Type.STRING, description: 'One sentence referencing specific evidence from this user\'s data' },
              },
              required: ['name', 'score', 'status', 'note'],
            },
            description: 'Exactly 6 dimensions scored',
          },
          overall: { type: Type.NUMBER, description: 'Weighted overall score using the formula above' },
          headline: { type: Type.STRING, description: 'One sentence — honest, specific to this user, not generic motivation' },
        },
        required: ['dimensions', 'overall', 'headline'],
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  return data as AIReadinessScores;
}

export function isAIReadinessConfigured(): boolean {
  return Boolean(apiKey);
}
