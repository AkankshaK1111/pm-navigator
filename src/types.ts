// ── User Profile ──────────────────────────────────────────────
export type Background = 'engineer' | 'analyst' | 'consultant' | 'mba' | 'designer' | 'other';
export type CompanyTier = 'startup' | 'midmarket' | 'enterprise' | 'faang';
export type NetworkingLevel = 'none' | 'passive' | 'active' | 'strategic';

export interface UserProfile {
  name: string;
  currentRole: string;
  background: Background;
  yearsExperience: number;
  education: 'bachelors' | 'masters_mba' | 'phd' | 'other';
  skills: string[];
  targetCompanyTier: CompanyTier;
  hasBuiltProducts: boolean;
  hasManagedStakeholders: boolean;
  hasUsedDataForDecisions: boolean;
  hasAIExperience: boolean;
  hasSideProjects: boolean;
  prepMonths: number;
  mockInterviewsDone: number;
  networking: NetworkingLevel;
}

// ── PM Roles ──────────────────────────────────────────────────
export interface PMRole {
  id: string;
  name: string;
  description: string;
  requiredStrengths: string[];
  typicalBackground: Background[];
  salaryRange: string;
  demandLevel: 'high' | 'medium' | 'low';
  aiRelevance: string;
  entryDifficulty: 'low' | 'medium' | 'high' | 'very_high';
}

// ── Assessment ────────────────────────────────────────────────
export type FitVerdict = 'strong_fit' | 'good_fit' | 'needs_work' | 'consider_alternatives';

export interface Gap {
  skill: string;
  currentLevel: number; // 1-5
  requiredLevel: number; // 1-5
  priority: 'critical' | 'important' | 'nice_to_have';
  recommendation: string;
}

export interface RoleMatch {
  role: PMRole;
  matchScore: number; // 0-100
  explanation: string;
}

export interface AssessmentResult {
  fitScore: number; // 0-100
  fitVerdict: FitVerdict;
  roleMatches: RoleMatch[];
  gapAnalysis: Gap[];
  readinessLevel: 'not_ready' | 'early' | 'developing' | 'interview_ready';
  timeToReady: string;
  personalityFit: string;
  strengths: string[];
  weaknesses: string[];
}

// ── Roadmap ───────────────────────────────────────────────────
export type TaskType = 'learn' | 'do' | 'build' | 'network' | 'practice';

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  resource: string | null;
  deliverable: string | null;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  tasks: RoadmapTask[];
  milestone: string;
  estimatedHours: number;
}

// ── Readiness ─────────────────────────────────────────────────
export interface ReadinessDimensions {
  productThinking: number;
  technicalFluency: number;
  communicationSkill: number;
  portfolioStrength: number;
  networkStrength: number;
  aiFluency: number;
  interviewPrep: number;
}

export type ReadinessLevel = 'not_ready' | 'early_prep' | 'developing' | 'almost_ready' | 'interview_ready';

export interface ReadinessScore {
  overallScore: number;
  level: ReadinessLevel;
  dimensions: ReadinessDimensions;
  weeklyChange: number;
  nextMilestone: string;
  estimatedWeeksToReady: number;
  honestAssessment: string;
}

// ── Mock Interview ────────────────────────────────────────────
export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  strongAnswerExample: string;
  failureModes: string[];
}

// ── Supabase / Persistence ────────────────────────────────────
export interface SavedProgress {
  oderedProfile: UserProfile | null;
  assessmentResult: AssessmentResult | null;
  completedTaskIds: string[];
  currentWeek: number;
  mockInterviewHistory: MockInterviewRecord[];
  startedAt: string; // ISO date
}

export interface MockInterviewRecord {
  id: string;
  questionType: string;
  questionText: string;
  answerText: string;
  score: number;
  feedback: InterviewFeedback | null;
  createdAt: string;
}

// Legacy compat for landing page components
export interface RoadmapItem {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  status: 'pending' | 'in-progress' | 'completed';
}
