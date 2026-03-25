import {
  UserProfile,
  AssessmentResult,
  MockInterviewRecord,
  SavedProgress,
  ResumeData,
  GateScore,
  AIReadinessScores,
  DailyTaskRecord,
  NorthMessage,
  StreakXPState,
} from '@/src/types';

const STORAGE_KEY = 'pm_navigator_progress';

function getDefaultProgress(): SavedProgress {
  return {
    oderedProfile: null,
    assessmentResult: null,
    completedTaskIds: [],
    currentWeek: 1,
    mockInterviewHistory: [],
    startedAt: new Date().toISOString(),
    resumeData: null,
    gateScore: null,
    aiReadinessScores: null,
    dailyTaskHistory: [],
    targetCompany: null,
    northChatHistory: [],
    streakXP: null,
  };
}

export function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full or unavailable
  }
}

export function saveProfile(profile: UserProfile): void {
  const progress = loadProgress();
  progress.oderedProfile = profile;
  saveProgress(progress);
}

export function saveAssessmentResult(result: AssessmentResult): void {
  const progress = loadProgress();
  progress.assessmentResult = result;
  saveProgress(progress);
}

export function toggleTaskCompletion(taskId: string): boolean {
  const progress = loadProgress();
  const idx = progress.completedTaskIds.indexOf(taskId);
  if (idx === -1) {
    progress.completedTaskIds.push(taskId);
    saveProgress(progress);
    return true;
  } else {
    progress.completedTaskIds.splice(idx, 1);
    saveProgress(progress);
    return false;
  }
}

export function isTaskCompleted(taskId: string): boolean {
  const progress = loadProgress();
  return progress.completedTaskIds.includes(taskId);
}

export function saveMockInterview(record: MockInterviewRecord): void {
  const progress = loadProgress();
  progress.mockInterviewHistory.push(record);
  saveProgress(progress);
}

export function setCurrentWeek(week: number): void {
  const progress = loadProgress();
  progress.currentWeek = week;
  saveProgress(progress);
}

// ── Compass Feature Storage ─────────────────────────────────

export function saveResumeData(data: ResumeData): void {
  const progress = loadProgress();
  progress.resumeData = data;
  saveProgress(progress);
}

export function saveGateScore(score: GateScore): void {
  const progress = loadProgress();
  progress.gateScore = score;
  saveProgress(progress);
}

export function saveAIReadinessScores(scores: AIReadinessScores): void {
  const progress = loadProgress();
  progress.aiReadinessScores = scores;
  saveProgress(progress);
}

export function saveDailyTaskResult(record: DailyTaskRecord): void {
  const progress = loadProgress();
  progress.dailyTaskHistory.push(record);
  saveProgress(progress);
}

export function saveTargetCompany(company: string): void {
  const progress = loadProgress();
  progress.targetCompany = company;
  saveProgress(progress);
}

export function saveNorthChatHistory(messages: NorthMessage[]): void {
  const progress = loadProgress();
  progress.northChatHistory = messages;
  saveProgress(progress);
}

export function saveStreakXP(streakXP: StreakXPState): void {
  const progress = loadProgress();
  progress.streakXP = streakXP;
  saveProgress(progress);
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
