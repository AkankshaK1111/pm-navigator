import Groq from 'groq-sdk';
import type { DailyTaskScore, TaskScoringType } from '@/src/types';

const apiKey = process.env.GROQ_API_KEY;

const RUBRICS: Record<TaskScoringType, string> = {
  'product-teardown': `Score this product teardown:
80-100: Identifies the USER, the PROBLEM, and the METRIC that would move. All three present with specificity.
60-79: Has two of three clearly, one dimension is weak or generic.
40-59: Leads with a solution ("I'd add X") without grounding in user problem.
0-39: Too generic — could apply to any product.`,

  'metric-diagnosis': `Score this metric diagnosis:
80-100: Structured decomposition, multiple hypotheses with data sources, prioritized by likelihood and impact.
60-79: Good decomposition but missing one of: multiple hypotheses, data validation, or prioritization.
40-59: Lists possible causes without structure. No prioritization or validation plan.
0-39: Guesses at causes without analytical framework.`,

  'business-case': `Score this business case:
80-100: Clear market sizing, competitive positioning, revenue model, and risk assessment.
60-79: Good structure but missing one of: market sizing, competitive context, or revenue reasoning.
40-59: Opinion without supporting logic.
0-39: No business reasoning.`,

  'technical-tradeoff': `Score this technical tradeoff:
80-100: Articulates both options, identifies tradeoffs, considers user impact, defensible recommendation.
60-79: Understands tradeoff but doesn't fully articulate user impact.
40-59: Describes options without meaningful comparison.
0-39: No technical depth.`,

  'ai-feature-design': `Score this AI feature design:
80-100: AI-native capability, explains data/model, considers failure modes, clear user value.
60-79: Good AI application but missing one of: data/model reasoning, failure handling, or user value.
40-59: "Add AI to X" without explaining what AI does differently.
0-39: No understanding of AI capabilities.`,

  'stakeholder-conflict': `Score this stakeholder response:
80-100: Acknowledges other perspective, data-backed reasoning, resolution path, maintains relationship.
60-79: Good reasoning but either dismisses other perspective or agrees too easily.
40-59: Defends position without acknowledging other side.
0-39: No conflict resolution skill shown.`,
};

/**
 * Score a daily practice task using AI with type-specific rubrics.
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
  if (!apiKey) throw new Error('AI API key not configured');
  if (!text || text.length < 20) throw new Error('Response too short to score');

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
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
Current score in ${dimension}: ${currentDimScore || 50}/100.
Estimate dimension point impact:
- Excellent (80-100): +3 to +5 points
- Good (60-79): +2 to +3 points
- Developing (40-59): +1 point
- Weak (0-39): +0 points
- Cap new estimate at 100

Return JSON with this exact structure:
{
  "score": 0-100,
  "headline": "One sentence about what their response reveals",
  "strength": "One specific thing they did well",
  "gap": "One specific thing they missed",
  "dimensionImpact": {
    "name": "${dimension}",
    "delta": 0-5,
    "newEstimate": ${currentDimScore || 50} + delta (max 100)
  }
}`;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  const data = JSON.parse(response.choices[0]?.message?.content || '{}');
  return data as DailyTaskScore;
}

export function isTaskScorerConfigured(): boolean {
  return Boolean(apiKey);
}
