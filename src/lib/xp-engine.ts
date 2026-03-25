import type { StreakXPState, XPSource, XPEvent, LevelDef } from '@/src/types';

// ── Level Definitions ───────────────────────────────────────
export const LEVELS: LevelDef[] = [
  { level: 1, title: 'Aspiring PM',         xpRequired: 0 },
  { level: 2, title: 'PM Intern',           xpRequired: 100 },
  { level: 3, title: 'Associate PM',        xpRequired: 300 },
  { level: 4, title: 'PM',                  xpRequired: 600 },
  { level: 5, title: 'Senior PM',           xpRequired: 1000 },
  { level: 6, title: 'Lead PM',             xpRequired: 1500 },
  { level: 7, title: 'Director of Product', xpRequired: 2200 },
  { level: 8, title: 'VP Product',          xpRequired: 3000 },
];

const XP_HISTORY_CAP = 500;

// ── Default State ───────────────────────────────────────────
export function getDefaultStreakXP(): StreakXPState {
  return {
    totalXP: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null,
    xpHistory: [],
    gateXPAwarded: false,
  };
}

// ── Date Helpers ────────────────────────────────────────────
export function getToday(): string {
  return new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD" in local tz
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isConsecutiveDay(prev: string, current: string): boolean {
  const prevDate = new Date(prev + 'T00:00:00');
  const currDate = new Date(current + 'T00:00:00');
  const diffMs = currDate.getTime() - prevDate.getTime();
  return diffMs === 86400000; // exactly 1 day
}

// ── Level Lookups ───────────────────────────────────────────
export function getLevelForXP(xp: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): LevelDef | null {
  const current = getLevelForXP(xp);
  const idx = LEVELS.findIndex(l => l.level === current.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp: number): number {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return 100; // max level
  const bandSize = next.xpRequired - current.xpRequired;
  const progress = xp - current.xpRequired;
  return Math.round((progress / bandSize) * 100);
}

// ── Core Award Function ─────────────────────────────────────
interface AwardResult {
  newState: StreakXPState;
  event: XPEvent;
  leveledUp: boolean;
  newLevel: LevelDef | null;
}

export function awardXP(
  state: StreakXPState,
  source: XPSource,
  baseXP: number,
  description: string,
): AwardResult {
  const today = getToday();
  const prevLevel = getLevelForXP(state.totalXP);

  // Guard: gate task is one-time only
  if (source === 'gate-task' && state.gateXPAwarded) {
    return {
      newState: state,
      event: { id: '', source, baseXP: 0, multiplier: 0, totalXP: 0, description, timestamp: today },
      leveledUp: false,
      newLevel: null,
    };
  }

  // Update streak
  let newStreak = state.currentStreak;
  if (state.lastActiveDate === null) {
    newStreak = 1;
  } else if (isSameDay(state.lastActiveDate, today)) {
    // Already active today — streak unchanged
  } else if (isConsecutiveDay(state.lastActiveDate, today)) {
    newStreak = state.currentStreak + 1;
  } else {
    newStreak = 1; // missed a day
  }

  const newBestStreak = Math.max(state.bestStreak, newStreak);

  // Compute multiplier
  const isFirstOfDay = !state.xpHistory.some(
    e => e.timestamp.startsWith(today)
  );
  let multiplier = 1;
  if (isFirstOfDay) multiplier *= 2;       // daily bonus
  if (newStreak >= 7) multiplier *= 1.5;   // streak bonus

  const totalXP = Math.round(baseXP * multiplier);

  // Create event
  const event: XPEvent = {
    id: `${source}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    source,
    baseXP,
    multiplier,
    totalXP,
    description,
    timestamp: new Date().toISOString(),
  };

  // Build new history (capped)
  const newHistory = [...state.xpHistory, event];
  if (newHistory.length > XP_HISTORY_CAP) {
    newHistory.splice(0, newHistory.length - XP_HISTORY_CAP);
  }

  const newTotalXP = state.totalXP + totalXP;
  const newLevel = getLevelForXP(newTotalXP);
  const leveledUp = newLevel.level > prevLevel.level;

  const newState: StreakXPState = {
    totalXP: newTotalXP,
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    lastActiveDate: today,
    xpHistory: newHistory,
    gateXPAwarded: source === 'gate-task' ? true : state.gateXPAwarded,
  };

  return {
    newState,
    event,
    leveledUp,
    newLevel: leveledUp ? newLevel : null,
  };
}
