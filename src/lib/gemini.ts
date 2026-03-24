import { GoogleGenAI, Type } from '@google/genai';
import type { UserProfile, AssessmentResult } from '@/src/types';

const apiKey = process.env.GEMINI_API_KEY;

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
}

/**
 * Enhance a rule-based assessment with Gemini AI insights.
 * Returns enhanced fields or null if Gemini is unavailable / fails.
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
    const ai = new GoogleGenAI({ apiKey });

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

For aiCareerNarrative: Write a 2-3 sentence narrative about how this specific person's background creates a unique PM story. This should be something they could use in interviews.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiPersonalityFit: {
              type: Type.STRING,
              description: 'A personalized 2-3 sentence assessment of how their personality and background fit PM, referencing specific details from their profile',
            },
            aiStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 specific strengths based on their profile — each should reference a concrete detail, not be generic',
            },
            aiWeaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 specific areas for growth — be honest and actionable, reference their actual gaps',
            },
            aiRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 specific, actionable next steps personalized to their situation. Each should be a concrete action, not vague advice.',
            },
            aiCareerNarrative: {
              type: Type.STRING,
              description: 'A 2-3 sentence career narrative they could use in PM interviews, connecting their background to PM',
            },
          },
          required: ['aiPersonalityFit', 'aiStrengths', 'aiWeaknesses', 'aiRecommendations', 'aiCareerNarrative'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    return null;
  }
}
