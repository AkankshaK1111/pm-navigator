import { UserProfile, AssessmentResult, MockInterviewRecord, SavedProgress } from '@/src/types';

const STORAGE_KEY = 'pm_navigator_progress';

function getDefaultProgress(): SavedProgress {
  return {
    oderedProfile: null,
    assessmentResult: null,
    completedTaskIds: [],
    currentWeek: 1,
    mockInterviewHistory: [],
    startedAt: new Date().toISOString(),
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

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
