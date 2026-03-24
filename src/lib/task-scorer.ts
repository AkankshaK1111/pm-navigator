import { GoogleGenAI, Type } from '@google/genai';
import type { DailyTaskScore, TaskScoringType } from '@/src/types';

const apiKey = process.env.GEMINI_API_KEY;

const RUBRICS: Record<TaskScoringType, string> = {
  'product-teardown': `Score this product teardown:
80-100: Identifies the USER, the PROBLEM, and the METRIC that would move. All three present with specificity.
60-79: Has two of three clearly, one dimension is weak or generic.
40-59: Leads with a solution ("I'd add X") without grounding in user problem. Common for new PM thinkers.
0-39: Too generic — could apply to any product. No evidence of structured thinking.`,

  'metric-diagnosis': `Score this metric diagnosis:
80-100: Structured decomposition into components, considers multiple hypotheses with data sources to validate each, prioritizes by likelihood and impact.
60-79: Good decomposition but missing one of: multiple hypotheses, data validation approach, or clear prioritization.
40-59: Lists possible causes but doesn't structure the diagnosis. No prioritization or validation plan.
0-39: Guesses at causes without any analytical framework. No mention of data.`,

  'business-case': `Score this business case:
80-100: Clear market sizing logic, competitive positioning, revenue model, and risk assessment. Shows understanding of unit economics.
60-79: Good structure but missing one of: market sizing, competitive context, or revenue reasoning.
40-59: Presents opinion without supporting logic. Says "should enter because it's a big market" without specifics.
0-39: No business reasoning. Just a product feature pitch without commercial framing.`,

  'technical-tradeoff': `Score this technical tradeoff analysis:
80-100: Clearly articulates both options, identifies specific tradeoffs (latency vs consistency, build vs buy), considers user impact, and makes a defensible recommendation.
60-79: Understands the tradeoff but doesn't fully articulate user impact or makes recommendation without clear reasoning.
40-59: Describes the options but doesn't compare them meaningfully. Says "it depends" without committing.
0-39: No technical depth. Describes what the feature does without engaging with the tradeoff.`,

  'ai-feature-design': `Score this AI feature design:
80-100: Proposes a genuinely AI-native capability (not an AI wrapper), explains what data/model powers it, considers failure modes, and articulates user value clearly.
60-79: Good AI application but missing one of: data/model reasoning, failure handling, or clear user value.
40-59: Proposes "add AI to X" without explaining what AI actually does differently. AI as a buzzword, not a capability.
0-39: No understanding of AI capabilities. Proposes something that doesn't need AI or isn't technically feasible.`,

  'stakeholder-conflict': `Score this stakeholder response:
80-100: Acknowledges the other perspective, provides data-backed reasoning, proposes a resolution path, and maintains relationship. PM-level influence without authority.
60-79: Good reasoning but either dismisses the other perspective or agrees too easily without defending their position.
40-59: Defends their position but doesn't acknowledge the other side. Comes across as confrontational or passive.
0-39: No conflict resolution skill shown. Either caves immediately or escalates unnecessarily.`,
};

/**
 * Score a daily practice task using AI with type-specific rubrics.
 * Port of compass-PM/api/score-task.js.
 */
export async function scoreDailyTask(
  text: string,
  taskType: TaskScoringType,
  taskPrompt: string,
  dimension: string,
  background: string,
  targetCompany: string,
  currentDimScore: number
): Promise<DailyTaskScore> {
  if (!apiKey) throw new Error('Gemini API key not configured');
  if (!text || text.length < 20) throw new Error('Response too short to score');

  const ai = new GoogleGenAI({ apiKey });
  const rubric = RUBRICS[taskType] || RUBRICS['product-teardown'];

  const prompt = `You are a PM skills assessor. Score this user's response to a daily practice task.

## Task Given
Type: ${taskType}
Dimension: ${dimension}
Prompt: "${taskPrompt}"

## User's Response
"${text}"

## User Context
Background: ${background || 'Not provided'}
Target company: ${targetCompany || 'Not specified'}

## Scoring Rubric
${rubric}

## Score Impact
The user's current score in ${dimension} is ${currentDimScore || 50}/100.
Based on the quality of this response, estimate how many points this practice would add to their ${dimension} score.
Rules:
- Excellent response (80-100): +3 to +5 points
- Good response (60-79): +2 to +3 points
- Developing response (40-59): +1 point
- Weak response (0-39): +0 points (not enough depth to improve)
- Cap the new estimate at 100`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 600,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: '0-100 score' },
          headline: { type: Type.STRING, description: `One sentence — what their response reveals about their ${dimension}` },
          strength: { type: Type.STRING, description: 'One specific thing they did well' },
          gap: { type: Type.STRING, description: 'One specific thing they missed' },
          dimensionImpact: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Dimension name' },
              delta: { type: Type.NUMBER, description: '+0 to +5 points' },
              newEstimate: { type: Type.NUMBER, description: 'Current score + delta, max 100' },
            },
            required: ['name', 'delta', 'newEstimate'],
          },
        },
        required: ['score', 'headline', 'strength', 'gap', 'dimensionImpact'],
      },
    },
  });

  const data = JSON.parse(response.text || '{}');
  return data as DailyTaskScore;
}

export function isTaskScorerConfigured(): boolean {
  return Boolean(apiKey);
}
