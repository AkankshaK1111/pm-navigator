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
  // Compass features
  resumeData: ResumeData | null;
  gateScore: GateScore | null;
  aiReadinessScores: AIReadinessScores | null;
  dailyTaskHistory: DailyTaskRecord[];
  targetCompany: string | null;
  northChatHistory: NorthMessage[];
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

// ── Resume Parsing ──────────────────────────────────────────
export interface PMHighlight {
  text: string;
  type: 'strength' | 'warning' | 'action';
  label: string;
}

export interface ResumeData {
  name: string;
  email: string | null;
  phone: string | null;
  currentRole: string;
  totalExperience: string;
  experience: string[];
  awards: string[];
  pmHighlights: PMHighlight[];
  skills: string[];
  fileName?: string;
}

// ── Gate Task ───────────────────────────────────────────────
export interface GateScore {
  score: number;
  thinkingStyle: string;
  headline: string;
  strength: string;
  gap: string;
}

// ── AI Readiness Scoring ────────────────────────────────────
export type AIReadinessStatus = 'Gap' | 'Developing' | 'Solid' | 'Strong';

export interface AIReadinessDimension {
  name: string;
  score: number;
  status: AIReadinessStatus;
  note: string;
}

export interface AIReadinessScores {
  dimensions: AIReadinessDimension[];
  overall: number;
  headline: string;
}

// ── Daily Task Scoring ──────────────────────────────────────
export type TaskScoringType =
  | 'product-teardown'
  | 'metric-diagnosis'
  | 'business-case'
  | 'technical-tradeoff'
  | 'ai-feature-design'
  | 'stakeholder-conflict';

export interface DailyTaskScore {
  score: number;
  headline: string;
  strength: string;
  gap: string;
  dimensionImpact: {
    name: string;
    delta: number;
    newEstimate: number;
  };
}

export interface DailyTaskRecord {
  id: string;
  taskType: TaskScoringType;
  taskPrompt: string;
  dimension: string;
  answerText: string;
  result: DailyTaskScore;
  createdAt: string;
}

// ── Market Data ─────────────────────────────────────────────
export interface HiringBar {
  productSense: number;
  analyticalDepth: number;
  businessFraming: number;
  technicalCredibility: number;
  aiFluency: number;
  behavioural: number;
}

export interface MarketDataCompany {
  name: string;
  stage: string;
  vertical: string;
  city: string;
  pmTeamSize: string;
  annualJuniorPMIntake: string;
  hasAPMProgram: boolean;
  hiringMethod: string;
  interviewFormat: string[];
  interviewRounds: number;
  hiringBar: HiringBar;
  switcherFriendly: boolean;
  switcherNote: string;
  commonRejectionReasons: string[];
  salaryRange: string;
  recentSignals: string[];
  topRoles: string[];
  skillsWeighted: string[];
}

export interface MarketJobListing {
  id: string;
  title: string;
  company: string;
  stage: string;
  vertical: string;
  city: string;
  salary: string;
  postedDaysAgo: number;
  requirements: Partial<HiringBar>;
  description: string;
  interviewRounds: number;
  switcherFriendly: boolean;
}

export interface MarketTrend {
  trend: string;
  detail: string;
  impact: string;
  relevantDimension: string | null;
  source: string;
}

export interface TransitionProfile {
  background: string;
  conversionRate: string;
  avgTimeToOffer: string;
  bestFitCompanies: string[];
  note: string;
}

export interface MarketData {
  companies: MarketDataCompany[];
  marketTrends: MarketTrend[];
  transitionIntelligence: {
    successRateByBackground: TransitionProfile[];
    switcherFriendlyRanking: Array<{ company: string; score: number; reason: string }>;
  };
  interviewFormats: Record<string, { typical: string[]; keyDifference: string }>;
  compensation: Record<string, Array<{ level: string; tier: string; range: string }>>;
  jobListings: MarketJobListing[];
}

// ── Job Intelligence ────────────────────────────────────────
export interface JobMatch {
  title: string;
  company: string;
  stage: string;
  vertical: string;
  city: string;
  fit: number;
  isTarget: boolean;
  gapCount: number;
  gapNote: string;
  salary: string;
  interviewRounds: number;
}

export interface JobListingWithFit extends MarketJobListing {
  fitPercent: number;
  dimComparisons: Array<{ dim: string; user: number; required: number; met: boolean }>;
}

export interface TrendSignal {
  text: string;
  impact: 'positive' | 'warning' | 'neutral' | 'negative';
}

// ── Post-Rejection Agent ────────────────────────────────────
export interface RejectionRootCause {
  dimension: string;
  userScore: number;
  companyBar: number;
  gap: number;
  explanation: string;
}

export interface RejectionPlanDay {
  day: number;
  task: string;
  output: string;
  time: string;
}

export interface RejectionPlanWeek {
  week: number;
  theme: string;
  days: RejectionPlanDay[];
}

export interface RejectionDiagnosis {
  company: string;
  round: string;
  headline: string;
  rootCause: {
    primary: RejectionRootCause;
    secondary: RejectionRootCause;
  };
  recoveryPlan: {
    duration: string;
    focusAreas: string[];
    weeks: RejectionPlanWeek[];
  };
  reapplySignal: string;
  ragSource?: string;
}

// ── North AI Chat ───────────────────────────────────────────
export interface NorthMessage {
  id: string;
  role: 'user' | 'north';
  text: string;
  timestamp: string;
}

export interface NorthContext {
  name: string;
  background: string;
  targetCompany: string;
  currentRole: string;
  totalExperience: string;
  readinessOverall: number | null;
  gateScore: GateScore | null;
  resumeHighlights: PMHighlight[];
  aiDimensions: AIReadinessDimension[];
}

// Legacy compat for landing page components
export interface RoadmapItem {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  status: 'pending' | 'in-progress' | 'completed';
}
