import { UserProfile, RoleMatch } from '@/src/types';
import { PM_ROLES } from '@/src/data/pm-roles';
import { BACKGROUND_ROLE_MODIFIERS } from '@/src/data/scoring-rules';

export function matchRoles(profile: UserProfile): RoleMatch[] {
  const modifiers = BACKGROUND_ROLE_MODIFIERS[profile.background] || BACKGROUND_ROLE_MODIFIERS.other;

  const scored = PM_ROLES.map(role => {
    let score = 50;

    // Background modifier
    score += modifiers[role.id] || 0;

    // Skill overlap boost
    const overlap = role.requiredStrengths.filter(rs =>
      profile.skills.some(s => s.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(s.toLowerCase()))
    ).length;
    score += (overlap / Math.max(1, role.requiredStrengths.length)) * 25;

    // Experience boosts
    if (profile.hasBuiltProducts) score += 5;
    if (profile.hasAIExperience && role.id === 'ai_ml_pm') score += 12;
    if (profile.hasManagedStakeholders && role.id === 'b2b_enterprise_pm') score += 8;
    if (profile.hasUsedDataForDecisions && ['growth_pm', 'ai_ml_pm'].includes(role.id)) score += 5;

    // Years of experience adjustment
    if (profile.yearsExperience >= 5 && role.entryDifficulty === 'high') score += 5;
    if (profile.yearsExperience < 2 && role.entryDifficulty === 'very_high') score -= 10;

    // FAANG targeting penalty for hard roles
    if (profile.targetCompanyTier === 'faang' && role.entryDifficulty === 'very_high') score -= 5;

    const matchScore = Math.max(0, Math.min(100, Math.round(score)));

    let explanation = '';
    if (matchScore >= 70) {
      explanation = `Strong match — your ${profile.background} background and skills align well with ${role.name} requirements.`;
    } else if (matchScore >= 50) {
      explanation = `Moderate match — you have a foundation for ${role.name}, but will need to build specific skills like ${role.requiredStrengths.slice(-1)[0]}.`;
    } else {
      explanation = `Stretch role — ${role.name} requires significant development in areas outside your current ${profile.background} background.`;
    }

    return { role, matchScore, explanation };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
