import type { Background, Gap } from '@/src/types';

// ── Background → Role Score Modifiers ────────────────────────
export const BACKGROUND_ROLE_MODIFIERS: Record<Background, Record<string, number>> = {
  engineer: {
    technical_pm: 15,
    platform_pm: 10,
    ai_ml_pm: 5,
    growth_pm: -5,
    consumer_pm: 0,
    b2b_enterprise_pm: -5,
  },
  analyst: {
    growth_pm: 15,
    consumer_pm: 10,
    ai_ml_pm: 5,
    technical_pm: -5,
    b2b_enterprise_pm: 0,
    platform_pm: -5,
  },
  consultant: {
    b2b_enterprise_pm: 15,
    growth_pm: 10,
    consumer_pm: 5,
    technical_pm: -10,
    platform_pm: -10,
    ai_ml_pm: -5,
  },
  mba: {
    b2b_enterprise_pm: 10,
    consumer_pm: 10,
    growth_pm: 5,
    technical_pm: -15,
    platform_pm: -10,
    ai_ml_pm: -5,
  },
  designer: {
    consumer_pm: 15,
    growth_pm: 10,
    b2b_enterprise_pm: 5,
    technical_pm: -15,
    platform_pm: -10,
    ai_ml_pm: -5,
  },
  other: {
    technical_pm: 0,
    platform_pm: 0,
    ai_ml_pm: 0,
    growth_pm: 0,
    consumer_pm: 0,
    b2b_enterprise_pm: 0,
  },
};

// ── Background → Top 3 Skill Gaps ───────────────────────────
export const BACKGROUND_GAPS: Record<Background, Gap[]> = {
  engineer: [
    {
      skill: 'Business Framing',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Complete 3 product teardowns focusing on business model analysis',
    },
    {
      skill: 'User Empathy',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Conduct 5 user interviews on a real problem you care about',
    },
    {
      skill: 'Stakeholder Communication',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'important',
      recommendation:
        'Practice presenting a product decision to a non-technical audience 3 times',
    },
  ],
  analyst: [
    {
      skill: 'Strategic Thinking',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Write 3 one-page product strategy memos for products you use daily',
    },
    {
      skill: 'Communication',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Record yourself presenting a product pitch and review for filler words and structure',
    },
    {
      skill: 'Product Vision',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'important',
      recommendation:
        "Draft a 6-month product roadmap for a product you'd love to build",
    },
  ],
  consultant: [
    {
      skill: 'Technical Credibility',
      currentLevel: 1,
      requiredLevel: 3,
      priority: 'critical',
      recommendation:
        'Build a functional prototype using a no-code tool like Bubble or Retool',
    },
    {
      skill: 'Data Fluency',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Complete a SQL + analytics project using a public dataset like Kaggle',
    },
    {
      skill: 'Product Intuition',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'important',
      recommendation:
        'Ship a small side project end-to-end in 4 weeks',
    },
  ],
  mba: [
    {
      skill: 'Technical Credibility',
      currentLevel: 1,
      requiredLevel: 3,
      priority: 'critical',
      recommendation:
        'Learn API basics and build a simple integration using Zapier or Make',
    },
    {
      skill: 'Hands-on Product Work',
      currentLevel: 1,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Ship a side project from idea to launch in 30 days',
    },
    {
      skill: 'Execution Speed',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'important',
      recommendation:
        'Run a 1-week design sprint solving a real problem, document every step',
    },
  ],
  designer: [
    {
      skill: 'Data-Driven Thinking',
      currentLevel: 1,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Set up analytics for a personal project and make 3 data-driven decisions',
    },
    {
      skill: 'Business Acumen',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Analyze the business models of 5 products in your portfolio',
    },
    {
      skill: 'Technical Literacy',
      currentLevel: 1,
      requiredLevel: 3,
      priority: 'important',
      recommendation:
        'Complete a basic API and database fundamentals course',
    },
  ],
  other: [
    {
      skill: 'Product Thinking',
      currentLevel: 1,
      requiredLevel: 4,
      priority: 'critical',
      recommendation:
        'Deconstruct 5 products you use daily: identify the user problem, value prop, and key metrics',
    },
    {
      skill: 'Technical Literacy',
      currentLevel: 1,
      requiredLevel: 3,
      priority: 'critical',
      recommendation:
        'Complete a beginner web development course to understand how software is built',
    },
    {
      skill: 'Analytical Skills',
      currentLevel: 1,
      requiredLevel: 3,
      priority: 'important',
      recommendation:
        'Learn SQL basics and analyze a public dataset to answer 3 product questions',
    },
  ],
};

// ── Score Component Weights (must sum to 100) ────────────────
export const SCORE_WEIGHTS: Record<string, number> = {
  backgroundMatch: 25,
  skillsAlignment: 20,
  experienceQuality: 20,
  preparationLevel: 15,
  networkStrength: 10,
  aiReadiness: 10,
};

// ── Bonus Modifiers (added on top of base score) ─────────────
export const BONUS_MODIFIERS: Record<string, number> = {
  sideProjects: 20,
  strategicNetworking: 25,
  aiExperience: 15,
  thirtyPlusMocks: 20,
};

// ── Prep Months → Readiness Level ────────────────────────────
export const READINESS_THRESHOLDS: { maxMonths: number; level: string }[] = [
  { maxMonths: 3, level: 'not_ready' },
  { maxMonths: 6, level: 'early' },
  { maxMonths: 12, level: 'developing' },
  { maxMonths: Infinity, level: 'interview_ready' },
];

// ── FAANG Reality Check ──────────────────────────────────────
export const FAANG_REALITY_CHECK: string =
  'Only 7% of FAANG PMs were hired with zero prior PM experience. Cold application conversion rate is 0.12%.';
