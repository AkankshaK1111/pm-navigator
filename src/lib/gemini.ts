import Groq from 'groq-sdk';
import type { UserProfile, AssessmentResult } from '@/src/types';

const apiKey = process.env.GROQ_API_KEY;

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
}

/**
 * Enhance a rule-based assessment with AI insights.
 */
export async function enhanceAssessmentWithAI(
  profile: UserProfile,
  baseResult: AssessmentResult
): Promise<{
  aiPersonalityFit: string;
  aiStrengths: string[];
  aiWeaknesses: string[];
  aiRecommendations: string[];
  aiCareerNarrative: string;
} | null> {
  if (!apiKey) return null;

  try {
    const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

    const prompt = `You are a senior PM career coach who has helped 500+ professionals transition into product management. Analyze this candidate's profile and assessment results.

CANDIDATE PROFILE:
- Name: ${profile.name}
- Current Role: ${profile.currentRole}
- Background: ${profile.background}
- Years of Experience: ${profile.yearsExperience}
- Education: ${profile.education}
- Skills: ${profile.skills.join(', ') || 'None selected'}
- Target Company Tier: ${profile.targetCompanyTier}
- Has Built Products: ${profile.hasBuiltProducts}
- Has Managed Stakeholders: ${profile.hasManagedStakeholders}
- Has Used Data for Decisions: ${profile.hasUsedDataForDecisions}
- Has AI Experience: ${profile.hasAIExperience}
- Has Side Projects: ${profile.hasSideProjects}
- Months Preparing: ${profile.prepMonths}
- Mock Interviews Done: ${profile.mockInterviewsDone}
- Networking Level: ${profile.networking}

RULE-BASED ASSESSMENT (already computed):
- Fit Score: ${baseResult.fitScore}/100
- Verdict: ${baseResult.fitVerdict}
- Top Role Match: ${baseResult.roleMatches[0]?.role.name || 'N/A'} (${baseResult.roleMatches[0]?.matchScore || 0}%)
- Readiness Level: ${baseResult.readinessLevel}
- Time to Ready: ${baseResult.timeToReady}

Provide deeply personalized insights. Be honest and specific — reference their actual background, not generic advice. If the score is low, don't sugarcoat it.

For aiCareerNarrative: Write a 2-3 sentence narrative about how this specific person's background creates a unique PM story.

Return JSON with this exact structure:
{
  "aiPersonalityFit": "A personalized 2-3 sentence assessment",
  "aiStrengths": ["strength1", "strength2", "strength3"],
  "aiWeaknesses": ["weakness1", "weakness2", "weakness3"],
  "aiRecommendations": ["rec1", "rec2", "rec3", "rec4"],
  "aiCareerNarrative": "2-3 sentence career narrative"
}`;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const data = JSON.parse(response.choices[0]?.message?.content || '{}');
    return data;
  } catch {
    return null;
  }
}
