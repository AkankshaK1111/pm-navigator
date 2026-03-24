import { UserProfile, ReadinessScore, ReadinessLevel, ReadinessDimensions } from '@/src/types';

export function calculateReadiness(
  profile: UserProfile,
  completedTaskIds: string[],
  currentWeek: number,
  totalTasks: number
): ReadinessScore {
  const dimensions = calculateDimensions(profile, completedTaskIds, currentWeek);
  const overallScore = Math.round(
    dimensions.productThinking * 0.20 +
    dimensions.technicalFluency * 0.15 +
    dimensions.communicationSkill * 0.15 +
    dimensions.portfolioStrength * 0.15 +
    dimensions.networkStrength * 0.15 +
    dimensions.aiFluency * 0.10 +
    dimensions.interviewPrep * 0.10
  );

  const level = getLevel(overallScore);
  const weeklyChange = estimateWeeklyChange(completedTaskIds.length, totalTasks, currentWeek);
  const nextMilestone = getNextMilestone(level, dimensions);
  const estimatedWeeksToReady = estimateWeeksToReady(overallScore, weeklyChange);
  const honestAssessment = getHonestAssessment(overallScore, profile);

  return {
    overallScore,
    level,
    dimensions,
    weeklyChange,
    nextMilestone,
    estimatedWeeksToReady,
    honestAssessment,
  };
}

function calculateDimensions(
  profile: UserProfile,
  completedTaskIds: string[],
  currentWeek: number
): ReadinessDimensions {
  const completed = new Set(completedTaskIds);
  const taskProgress = completedTaskIds.length;

  // Product thinking: teardowns, case studies, product briefs
  let productThinking = 20;
  if (profile.hasBuiltProducts) productThinking += 25;
  if (profile.hasUsedDataForDecisions) productThinking += 15;
  const productTasks = completedTaskIds.filter(id => id.includes('_1_') || id.includes('_2_') || id.includes('_5_')).length;
  productThinking += Math.min(40, productTasks * 10);

  // Technical fluency
  let technicalFluency = profile.background === 'engineer' ? 60 : 15;
  if (profile.skills.includes('Technical Architecture')) technicalFluency += 15;
  if (profile.skills.includes('SQL/Data Analysis')) technicalFluency += 10;
  const techTasks = completedTaskIds.filter(id => id.includes('_3_') || id.includes('_4_')).length;
  technicalFluency += Math.min(30, techTasks * 8);

  // Communication
  let communicationSkill = 20;
  if (profile.hasManagedStakeholders) communicationSkill += 25;
  if (profile.background === 'consultant') communicationSkill += 15;
  const commTasks = completedTaskIds.filter(id => id.includes('_7_') || id.includes('_8_')).length;
  communicationSkill += Math.min(35, commTasks * 10);

  // Portfolio
  let portfolioStrength = 0;
  if (profile.hasSideProjects) portfolioStrength += 30;
  if (profile.hasBuiltProducts) portfolioStrength += 20;
  const buildTasks = completedTaskIds.filter(id => id.includes('_9_') || id.includes('_10_')).length;
  portfolioStrength += Math.min(50, buildTasks * 12);

  // Network
  let networkStrength = 0;
  if (profile.networking === 'strategic') networkStrength += 50;
  else if (profile.networking === 'active') networkStrength += 30;
  else if (profile.networking === 'passive') networkStrength += 10;
  const networkTasks = completedTaskIds.filter(id => id.includes('_11_') || id.includes('_12_')).length;
  networkStrength += Math.min(50, networkTasks * 10);

  // AI fluency
  let aiFluency = 10;
  if (profile.hasAIExperience) aiFluency += 40;
  if (profile.skills.includes('AI/ML Concepts')) aiFluency += 20;

  // Interview prep
  let interviewPrep = 0;
  interviewPrep += Math.min(60, profile.mockInterviewsDone * 2);
  if (profile.prepMonths >= 6) interviewPrep += 20;
  if (profile.prepMonths >= 12) interviewPrep += 20;

  const cap = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  return {
    productThinking: cap(productThinking),
    technicalFluency: cap(technicalFluency),
    communicationSkill: cap(communicationSkill),
    portfolioStrength: cap(portfolioStrength),
    networkStrength: cap(networkStrength),
    aiFluency: cap(aiFluency),
    interviewPrep: cap(interviewPrep),
  };
}

function getLevel(score: number): ReadinessLevel {
  if (score < 30) return 'not_ready';
  if (score < 50) return 'early_prep';
  if (score < 70) return 'developing';
  if (score < 85) return 'almost_ready';
  return 'interview_ready';
}

function estimateWeeklyChange(completed: number, total: number, week: number): number {
  if (week <= 1) return 0;
  const avgPerWeek = completed / week;
  return Math.round(avgPerWeek * 3); // rough score impact per week
}

function getNextMilestone(level: ReadinessLevel, dims: ReadinessDimensions): string {
  if (level === 'not_ready') return 'Complete your first product teardown and 1 user interview';
  if (level === 'early_prep') {
    const weakest = Object.entries(dims).sort(([, a], [, b]) => a - b)[0][0];
    const labels: Record<string, string> = {
      productThinking: 'product teardowns and case studies',
      technicalFluency: 'technical fundamentals',
      communicationSkill: 'presentation and stakeholder communication practice',
      portfolioStrength: 'building portfolio pieces',
      networkStrength: 'networking outreach',
      aiFluency: 'AI literacy',
      interviewPrep: 'mock interviews',
    };
    return `Focus on ${labels[weakest] || 'your weakest area'} to level up`;
  }
  if (level === 'developing') return 'Complete 10+ mock interviews and secure 2 informational chats';
  if (level === 'almost_ready') return 'Do 5 more company-specific mock interviews and finalize target list';
  return 'You\'re ready — apply strategically to 10-15 well-researched roles';
}

function estimateWeeksToReady(score: number, weeklyChange: number): number {
  if (score >= 85) return 0;
  const gap = 85 - score;
  const ratePerWeek = Math.max(2, weeklyChange || 3);
  return Math.ceil(gap / ratePerWeek);
}

function getHonestAssessment(score: number, profile: UserProfile): string {
  if (score < 30) {
    return "You're in the exploration phase. Most aspirants spend 2-4 months here. Focus on completing foundational tasks before worrying about applications. The good news: you've started, which puts you ahead of the 60-70% who never move past consuming content.";
  }
  if (score < 50) {
    return "You're actively preparing but not yet competitive. The biggest trap at this stage is consuming more content instead of building. Complete a product teardown, ship a side project, or do 5 mock interviews — action compounds faster than learning.";
  }
  if (score < 70) {
    return "You have a solid foundation. Now shift from learning to proving — mock interviews, portfolio pieces, and strategic networking will move the needle more than another course. Start targeting specific companies.";
  }
  if (score < 85) {
    return "You're approaching interview-ready. Focus on company-specific preparation, refine your narrative, and increase mock interview intensity. Your network and portfolio should be doing the talking now.";
  }
  return "You're competitive for PM roles. Apply strategically — target 10-15 well-researched roles, not 50 spray-and-pray applications. Referrals convert at 7x the rate of cold applications. You've put in the work; now execute the job search like a product launch.";
}
