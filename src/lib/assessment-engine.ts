import {
  UserProfile,
  AssessmentResult,
  FitVerdict,
  Gap,
  RoleMatch,
  Background,
} from '@/src/types';
import { PM_ROLES } from '@/src/data/pm-roles';
import {
  BACKGROUND_ROLE_MODIFIERS,
  BACKGROUND_GAPS,
  SCORE_WEIGHTS,
  BONUS_MODIFIERS,
} from '@/src/data/scoring-rules';

// ── Main Assessment Function ──────────────────────────────────
export function runAssessment(profile: UserProfile): AssessmentResult {
  const backgroundScore = scoreBackground(profile);
  const skillsScore = scoreSkills(profile);
  const experienceScore = scoreExperience(profile);
  const prepScore = scorePreparation(profile);
  const networkScore = scoreNetworking(profile);
  const aiScore = scoreAIReadiness(profile);

  const rawScore = backgroundScore + skillsScore + experienceScore + prepScore + networkScore + aiScore;

  // Apply bonuses (capped at 100)
  let bonuses = 0;
  if (profile.hasSideProjects) bonuses += BONUS_MODIFIERS.sideProjects;
  if (profile.networking === 'strategic') bonuses += BONUS_MODIFIERS.strategicNetworking;
  if (profile.hasAIExperience) bonuses += BONUS_MODIFIERS.aiExperience;
  if (profile.mockInterviewsDone >= 30) bonuses += BONUS_MODIFIERS.thirtyPlusMocks;

  // Bonuses add up to 20% of their value (diminishing returns)
  const fitScore = Math.min(100, Math.round(rawScore + bonuses * 0.2));

  const fitVerdict = getFitVerdict(fitScore);
  const roleMatches = matchRoles(profile);
  const gapAnalysis = analyzeGaps(profile);
  const readinessLevel = getReadinessLevel(profile.prepMonths);
  const timeToReady = estimateTimeToReady(profile);
  const personalityFit = getPersonalityFit(profile);
  const { strengths, weaknesses } = getStrengthsWeaknesses(profile);

  return {
    fitScore,
    fitVerdict,
    roleMatches,
    gapAnalysis,
    readinessLevel,
    timeToReady,
    personalityFit,
    strengths,
    weaknesses,
  };
}

// ── Scoring Components ────────────────────────────────────────

function scoreBackground(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.backgroundMatch;
  let score = 0;

  // Years of experience contribution (2-8 years is sweet spot)
  const yearsScore = profile.yearsExperience >= 2 && profile.yearsExperience <= 8
    ? 1.0
    : profile.yearsExperience > 8
      ? 0.7
      : profile.yearsExperience / 2;
  score += yearsScore * (max * 0.5);

  // Background relevance (some backgrounds have higher base match)
  const bgScores: Record<Background, number> = {
    engineer: 0.85,
    analyst: 0.75,
    consultant: 0.80,
    mba: 0.70,
    designer: 0.65,
    other: 0.45,
  };
  score += (bgScores[profile.background] || 0.45) * (max * 0.5);

  return Math.round(score);
}

function scoreSkills(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.skillsAlignment;
  const coreSkills = [
    'Product Strategy',
    'User Research',
    'Data Analysis',
    'Stakeholder Management',
    'A/B Testing',
  ];

  const matchCount = profile.skills.filter(s => coreSkills.includes(s)).length;
  const ratio = matchCount / coreSkills.length;

  // Bonus for breadth
  const breadthBonus = profile.skills.length >= 5 ? 0.1 : 0;

  return Math.round(Math.min(max, (ratio + breadthBonus) * max));
}

function scoreExperience(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.experienceQuality;
  let score = 0;
  const perItem = max / 4;

  if (profile.hasBuiltProducts) score += perItem;
  if (profile.hasManagedStakeholders) score += perItem;
  if (profile.hasUsedDataForDecisions) score += perItem;
  if (profile.hasSideProjects) score += perItem;

  return Math.round(score);
}

function scorePreparation(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.preparationLevel;
  let score = 0;

  // Prep months (diminishing returns after 12)
  const monthsNormalized = Math.min(profile.prepMonths / 12, 1);
  score += monthsNormalized * (max * 0.4);

  // Mock interviews (target: 30+)
  const mocksNormalized = Math.min(profile.mockInterviewsDone / 30, 1);
  score += mocksNormalized * (max * 0.35);

  // Side projects
  if (profile.hasSideProjects) score += max * 0.25;

  return Math.round(score);
}

function scoreNetworking(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.networkStrength;
  const scores: Record<string, number> = {
    none: 0,
    passive: 0.25,
    active: 0.6,
    strategic: 1.0,
  };
  return Math.round((scores[profile.networking] || 0) * max);
}

function scoreAIReadiness(profile: UserProfile): number {
  const max = SCORE_WEIGHTS.aiReadiness;
  let score = 0;

  if (profile.hasAIExperience) score += max * 0.7;
  if (profile.skills.includes('AI/ML Concepts')) score += max * 0.3;

  return Math.round(Math.min(max, score));
}

// ── Verdict & Matching ────────────────────────────────────────

function getFitVerdict(score: number): FitVerdict {
  if (score >= 75) return 'strong_fit';
  if (score >= 55) return 'good_fit';
  if (score >= 35) return 'needs_work';
  return 'consider_alternatives';
}

function matchRoles(profile: UserProfile): RoleMatch[] {
  const modifiers = BACKGROUND_ROLE_MODIFIERS[profile.background] || BACKGROUND_ROLE_MODIFIERS.other;

  const scored = PM_ROLES.map(role => {
    let baseScore = 50;

    // Background modifier
    const modifier = modifiers[role.id] || 0;
    baseScore += modifier;

    // Skill overlap
    const skillOverlap = role.requiredStrengths.filter(s =>
      profile.skills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
    ).length;
    baseScore += (skillOverlap / role.requiredStrengths.length) * 20;

    // Experience boosts
    if (profile.hasBuiltProducts && ['consumer_pm', 'growth_pm', 'platform_pm'].includes(role.id)) baseScore += 5;
    if (profile.hasAIExperience && role.id === 'ai_ml_pm') baseScore += 10;
    if (profile.hasManagedStakeholders && role.id === 'b2b_enterprise_pm') baseScore += 8;

    // Target tier adjustment
    if (profile.targetCompanyTier === 'faang' && role.entryDifficulty === 'very_high') baseScore -= 5;

    const matchScore = Math.max(0, Math.min(100, Math.round(baseScore)));

    return {
      role,
      matchScore,
      explanation: generateRoleExplanation(profile, role, matchScore),
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

function generateRoleExplanation(profile: UserProfile, role: any, score: number): string {
  const bg = profile.background;
  if (score >= 70) {
    return `Your ${bg} background aligns well with ${role.name}. Your experience with ${role.requiredStrengths.slice(0, 2).join(' and ')} gives you a strong foundation.`;
  }
  if (score >= 50) {
    return `${role.name} is achievable from your ${bg} background, but you'll need to develop ${role.requiredStrengths.slice(-2).join(' and ')}.`;
  }
  return `${role.name} would require significant skill development from your ${bg} background, particularly in ${role.requiredStrengths[0]}.`;
}

// ── Gap Analysis ──────────────────────────────────────────────

function analyzeGaps(profile: UserProfile): Gap[] {
  const baseGaps = BACKGROUND_GAPS[profile.background] || BACKGROUND_GAPS.other;

  return baseGaps.map(gap => {
    let currentLevel = gap.currentLevel;

    // Adjust current level based on profile signals
    if (gap.skill.toLowerCase().includes('technical') && profile.background === 'engineer') {
      currentLevel = Math.min(5, currentLevel + 2);
    }
    if (gap.skill.toLowerCase().includes('data') && profile.hasUsedDataForDecisions) {
      currentLevel = Math.min(5, currentLevel + 1);
    }
    if (gap.skill.toLowerCase().includes('stakeholder') && profile.hasManagedStakeholders) {
      currentLevel = Math.min(5, currentLevel + 1);
    }
    if (gap.skill.toLowerCase().includes('communication') && profile.hasManagedStakeholders) {
      currentLevel = Math.min(5, currentLevel + 1);
    }

    return { ...gap, currentLevel };
  });
}

// ── Readiness & Time Estimates ────────────────────────────────

function getReadinessLevel(prepMonths: number): AssessmentResult['readinessLevel'] {
  if (prepMonths < 3) return 'not_ready';
  if (prepMonths < 6) return 'early';
  if (prepMonths < 12) return 'developing';
  return 'interview_ready';
}

function estimateTimeToReady(profile: UserProfile): string {
  let weeksNeeded = 48; // default: ~12 months

  // Reduce based on prep already done
  weeksNeeded -= Math.min(24, profile.prepMonths * 2);

  // Reduce based on experience signals
  if (profile.hasBuiltProducts) weeksNeeded -= 8;
  if (profile.hasManagedStakeholders) weeksNeeded -= 4;
  if (profile.hasUsedDataForDecisions) weeksNeeded -= 4;
  if (profile.hasSideProjects) weeksNeeded -= 6;
  if (profile.mockInterviewsDone >= 10) weeksNeeded -= 4;
  if (profile.networking === 'strategic') weeksNeeded -= 6;
  if (profile.networking === 'active') weeksNeeded -= 3;

  // Harder for FAANG
  if (profile.targetCompanyTier === 'faang') weeksNeeded += 12;

  weeksNeeded = Math.max(4, weeksNeeded);

  if (weeksNeeded <= 8) return '2 months';
  if (weeksNeeded <= 16) return '3-4 months';
  if (weeksNeeded <= 26) return '5-6 months';
  if (weeksNeeded <= 40) return '7-10 months';
  return '12+ months';
}

function getPersonalityFit(profile: UserProfile): string {
  if (profile.background === 'engineer') {
    return 'Engineers who transition to PM often excel at technical credibility and systematic thinking. Your biggest challenge will be shifting from "how to build it" to "what to build and why."';
  }
  if (profile.background === 'consultant') {
    return 'Consultants bring excellent stakeholder management and structured thinking. Your challenge will be building technical credibility and developing product intuition beyond frameworks.';
  }
  if (profile.background === 'analyst') {
    return 'Analysts have strong data skills that PMs desperately need. Focus on developing strategic vision and persuasive communication to complement your analytical foundation.';
  }
  if (profile.background === 'mba') {
    return 'MBA grads bring business acumen and strategic thinking. The gap is usually hands-on execution and technical depth — ship something real to prove you can do, not just plan.';
  }
  if (profile.background === 'designer') {
    return 'Designers understand users deeply, which is PM gold. Build your data fluency and business acumen to complement your empathy-driven approach.';
  }
  return 'Your non-traditional background can be a differentiator if you frame it right. Focus on building PM-specific skills while leveraging your unique perspective.';
}

function getStrengthsWeaknesses(profile: UserProfile): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Strengths
  if (profile.yearsExperience >= 3) strengths.push('Solid professional experience to draw from in interviews');
  if (profile.hasBuiltProducts) strengths.push('Hands-on product building experience — this is rare and valuable');
  if (profile.hasManagedStakeholders) strengths.push('Cross-functional stakeholder management experience');
  if (profile.hasUsedDataForDecisions) strengths.push('Data-driven decision making background');
  if (profile.hasAIExperience) strengths.push('AI/ML experience — highly valued in 2026 PM market');
  if (profile.hasSideProjects) strengths.push('Side projects demonstrate initiative and product sense');
  if (profile.networking === 'strategic') strengths.push('Strong network — this gives you a 50-70% conversion advantage');
  if (profile.skills.length >= 5) strengths.push('Broad skill set across multiple PM competencies');
  if (profile.mockInterviewsDone >= 10) strengths.push('Solid mock interview practice');

  // Weaknesses
  if (!profile.hasBuiltProducts) weaknesses.push('No end-to-end product building experience — 78% of hiring managers value this');
  if (!profile.hasSideProjects) weaknesses.push('No side projects — 44% of aspirants have built nothing, which is a red flag');
  if (profile.networking === 'none') weaknesses.push('No networking — cold applications have 0.12% conversion rate');
  if (profile.prepMonths < 6) weaknesses.push('Preparation time below recommended minimum — experts suggest 12+ months');
  if (profile.mockInterviewsDone < 5) weaknesses.push('Insufficient mock interview practice — aim for 30+ before real interviews');
  if (!profile.hasAIExperience) weaknesses.push('No AI experience — 78% of PMs say AI literacy is now baseline');
  if (profile.targetCompanyTier === 'faang' && profile.yearsExperience < 3) {
    weaknesses.push('FAANG PM roles typically require 3+ years experience — only 7% were hired with zero PM experience');
  }

  // Ensure at least 2 each
  if (strengths.length === 0) strengths.push('Willingness to transition shows growth mindset');
  if (weaknesses.length === 0) weaknesses.push('Continue building depth in your strongest PM skill area');

  return { strengths: strengths.slice(0, 5), weaknesses: weaknesses.slice(0, 5) };
}

// Legacy export for compatibility
export const assessProfile = runAssessment;
