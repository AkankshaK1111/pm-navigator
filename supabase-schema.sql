-- PM Navigator — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ── Profiles ──────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  background text,
  years_experience integer,
  user_current_role text,
  target_company_tier text,
  full_profile jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Assessment Results ────────────────────────────────────────
create table if not exists public.assessment_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  fit_score integer not null,
  fit_verdict text not null,
  role_matches jsonb,
  gap_analysis jsonb,
  readiness_level text,
  created_at timestamptz default now()
);

alter table public.assessment_results enable row level security;

create policy "Users can view own assessments"
  on public.assessment_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own assessments"
  on public.assessment_results for insert
  with check (auth.uid() = user_id);

-- ── Roadmap Progress ──────────────────────────────────────────
create table if not exists public.roadmap_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  week_number integer not null,
  task_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, task_id)
);

alter table public.roadmap_progress enable row level security;

create policy "Users can view own progress"
  on public.roadmap_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.roadmap_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.roadmap_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.roadmap_progress for delete
  using (auth.uid() = user_id);

-- ── Mock Interviews ───────────────────────────────────────────
create table if not exists public.mock_interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_type text not null,
  question_text text not null,
  answer_text text,
  score integer,
  feedback jsonb,
  created_at timestamptz default now()
);

alter table public.mock_interviews enable row level security;

create policy "Users can view own interviews"
  on public.mock_interviews for select
  using (auth.uid() = user_id);

create policy "Users can insert own interviews"
  on public.mock_interviews for insert
  with check (auth.uid() = user_id);

-- ── Create profile on signup (trigger) ────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: auto-create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
