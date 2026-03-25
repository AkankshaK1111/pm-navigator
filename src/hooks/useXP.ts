import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/src/lib/auth-context';
import { saveStreakXP } from '@/src/lib/storage';
import {
  awardXP,
  getDefaultStreakXP,
  getLevelForXP,
  getNextLevel,
  getLevelProgress,
} from '@/src/lib/xp-engine';
import type { XPSource, StreakXPState, LevelDef } from '@/src/types';

interface UseXPReturn {
  streakXP: StreakXPState;
  level: LevelDef;
  nextLevel: LevelDef | null;
  levelProgress: number;
  award: (source: XPSource, baseXP: number, description: string) => void;
}

export function useXP(): UseXPReturn {
  const { progress, refreshProgress } = useAuth();
  const streakXP = progress.streakXP ?? getDefaultStreakXP();

  const level = useMemo(() => getLevelForXP(streakXP.totalXP), [streakXP.totalXP]);
  const nextLevel = useMemo(() => getNextLevel(streakXP.totalXP), [streakXP.totalXP]);
  const levelProgress = useMemo(() => getLevelProgress(streakXP.totalXP), [streakXP.totalXP]);

  const award = useCallback((source: XPSource, baseXP: number, description: string) => {
    const currentState = progress.streakXP ?? getDefaultStreakXP();
    const result = awardXP(currentState, source, baseXP, description);

    // Skip if nothing awarded (e.g. duplicate gate task)
    if (result.event.totalXP === 0) return;

    // Persist
    saveStreakXP(result.newState);
    refreshProgress();

    // Toast for XP gain
    const multiplierText = result.event.multiplier > 1
      ? ` (${result.event.multiplier}x bonus!)`
      : '';
    toast.success(`+${result.event.totalXP} XP${multiplierText}`, {
      description: description.length > 60 ? description.slice(0, 57) + '...' : description,
      duration: 2000,
    });

    // Toast for level-up
    if (result.leveledUp && result.newLevel) {
      setTimeout(() => {
        toast(`Level Up! You're now ${result.newLevel!.title}`, {
          description: `Level ${result.newLevel!.level} unlocked`,
          duration: 4000,
        });
      }, 500);
    }
  }, [progress.streakXP, refreshProgress]);

  return { streakXP, level, nextLevel, levelProgress, award };
}
