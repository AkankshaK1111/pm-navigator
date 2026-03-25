/**
 * Supabase-backed storage layer.
 * Falls back to localStorage when Supabase is not configured.
 */
import { supabase, isSupabaseConfigured } from './supabase';
import {
  UserProfile,
  AssessmentResult,
  MockInterviewRecord,
  SavedProgress,
} from '@/src/types';
import * as localStore from './storage';

// ── Auth helpers ──────────────────────────────────────────────
export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/' },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Profile CRUD ──────────────────────────────────────────────
export async function saveProfileToSupabase(profile: UserProfile): Promise<void> {
  // Always save locally as fallback
  localStore.saveProfile(profile);

  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    background: profile.background,
    years_experience: profile.yearsExperience,
    user_current_role: profile.currentRole,
    target_company_tier: profile.targetCompanyTier,
    full_profile: profile,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    // Supabase failed, localStorage still has it
  }
}

// ── Assessment CRUD ───────────────────────────────────────────
export async function saveAssessmentToSupabase(result: AssessmentResult): Promise<void> {
  localStore.saveAssessmentResult(result);

  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase.from('assessment_results').insert({
    user_id: user.id,
    fit_score: result.fitScore,
    fit_verdict: result.fitVerdict,
    role_matches: result.roleMatches,
    gap_analysis: result.gapAnalysis,
    readiness_level: result.readinessLevel,
  });

  if (error) {
    // fallback to localStorage
  }
}

// ── Roadmap Progress CRUD ─────────────────────────────────────
export async function saveTaskCompletionToSupabase(
  weekNumber: number,
  taskId: string,
  completed: boolean
): Promise<void> {
  // Always update localStorage
  localStore.toggleTaskCompletion(taskId);

  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;

  if (completed) {
    await supabase.from('roadmap_progress').insert({
      user_id: user.id,
      week_number: weekNumber,
      task_id: taskId,
      completed: true,
      completed_at: new Date().toISOString(),
    });
  } else {
    await supabase
      .from('roadmap_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('task_id', taskId);
  }
}

// ── Mock Interview CRUD ───────────────────────────────────────
export async function saveMockInterviewToSupabase(record: MockInterviewRecord): Promise<void> {
  localStore.saveMockInterview(record);

  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) return;

  await supabase.from('mock_interviews').insert({
    user_id: user.id,
    question_type: record.questionType,
    question_text: record.questionText,
    answer_text: record.answerText,
    score: record.score,
    feedback: record.feedback,
  });
}

// ── Sync: Load from Supabase → merge with localStorage ───────
export async function syncFromSupabase(): Promise<SavedProgress> {
  const local = localStore.loadProgress();

  if (!supabase) return local;
  const user = await getCurrentUser();
  if (!user) return local;

  try {
    // Fetch profile
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('full_profile')
      .eq('id', user.id)
      .single();

    if (profileRow?.full_profile) {
      local.oderedProfile = profileRow.full_profile;
    }

    // Fetch latest assessment
    const { data: assessmentRow } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (assessmentRow) {
      local.assessmentResult = {
        fitScore: assessmentRow.fit_score,
        fitVerdict: assessmentRow.fit_verdict,
        roleMatches: assessmentRow.role_matches,
        gapAnalysis: assessmentRow.gap_analysis,
        readinessLevel: assessmentRow.readiness_level,
        timeToReady: '',
        personalityFit: '',
        strengths: [],
        weaknesses: [],
      };
    }

    // Fetch completed tasks
    const { data: progressRows } = await supabase
      .from('roadmap_progress')
      .select('task_id')
      .eq('user_id', user.id)
      .eq('completed', true);

    if (progressRows) {
      const remoteIds = progressRows.map((r: any) => r.task_id);
      const merged = new Set([...local.completedTaskIds, ...remoteIds]);
      local.completedTaskIds = Array.from(merged);
    }

    // Save merged state back to localStorage
    localStore.saveProgress(local);
    return local;
  } catch {
    return local;
  }
}
