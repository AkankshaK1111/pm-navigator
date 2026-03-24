# PM Navigator — Complete Build Prompts Guide

## How to Use This Document

Each phase below contains **ready-to-paste prompts** for Claude (claude.ai, Claude Code, or any AI coding assistant). Run them in sequence. Each prompt builds on the previous phase's output.

**Prerequisites:** Node.js installed, a code editor (VS Code recommended), and a terminal.

**Tech Stack (100% Free):**
- Next.js 14+ (App Router)
- Tailwind CSS + Shadcn/ui
- Supabase (free tier — auth + database)
- Google Gemini API (free tier — AI features)
- Vercel (free hosting)

---

## PHASE 0 — Project Scaffolding

### Prompt 0.1 — Initialize the Project

```
I'm building a PM career navigation platform called "PM Navigator." Set up a Next.js 14 project with the App Router, Tailwind CSS, and Shadcn/ui.

The app helps aspiring product managers (2–8 years experience, from engineering/analyst/consultant/MBA backgrounds) assess their PM fit, get a personalised roadmap, and track readiness.

Please:
1. Run `npx create-next-app@latest pm-navigator` with TypeScript, Tailwind, App Router, and src/ directory
2. Install and initialize Shadcn/ui with the "new-york" style and slate base color
3. Add these Shadcn components: button, card, input, label, select, radio-group, progress, tabs, badge, separator, dialog, toast, accordion, textarea
4. Create this folder structure inside src/:
   - app/(marketing)/page.tsx — landing page
   - app/(app)/assessment/page.tsx
   - app/(app)/roadmap/page.tsx
   - app/(app)/dashboard/page.tsx
   - app/(app)/mock-interview/page.tsx
   - lib/assessment-engine.ts
   - lib/roadmap-engine.ts
   - lib/readiness-scorer.ts
   - lib/role-matcher.ts
   - lib/types.ts
   - data/scoring-rules.ts
   - data/roadmap-templates.ts
   - data/pm-roles.ts
   - data/interview-questions.ts
   - components/layout/navbar.tsx
   - components/layout/footer.tsx
   - components/assessment/ (empty dir)
   - components/roadmap/ (empty dir)
   - components/dashboard/ (empty dir)
5. Set up a global layout with the navbar and a clean, professional design. Use a dark navy (#1B2A4A) and teal (#0F6E56) accent color scheme with white backgrounds. Use "Plus Jakarta Sans" from Google Fonts as the primary font.
6. Add a placeholder page for each route with just the page title.

Show me the complete file tree and all files.
```

---

## PHASE 1 — Assessment Engine (Core Logic, No AI)

### Prompt 1.1 — Define Types & Scoring Rules

```
I'm building the PM Navigator assessment engine. This is the core of the product — a rule-based diagnostic that evaluates a user's background against PM role requirements.

Create the following files:

**1. src/lib/types.ts** — Define TypeScript interfaces:
- `UserProfile`: background (engineer | analyst | consultant | mba | designer | other), yearsExperience (number), currentRole (string), skills (string[]), targetCompanyTier (startup | midmarket | enterprise | faang), hasBuiltProducts (boolean), hasManagedStakeholders (boolean), hasUsedDataForDecisions (boolean), hasAIExperience (boolean), prepMonths (number), mockInterviewsDone (number), hasSideProjects (boolean), networking (none | passive | active | strategic)
- `AssessmentResult`: fitScore (0-100), fitVerdict (strong_fit | good_fit | needs_work | consider_alternatives), pmRoleMatch (PMRole[]), gapAnalysis (Gap[]), readinessLevel (not_ready | early | developing | interview_ready), personalityFit (string), timeToReady (string)
- `PMRole`: id, name, description, requiredStrengths (string[]), typicalBackground (string[]), salaryRange (string), demandLevel (high | medium | low), aiRelevance (string)
- `Gap`: skill (string), currentLevel (1-5), requiredLevel (1-5), priority (critical | important | nice_to_have), recommendation (string)
- `RoadmapWeek`: weekNumber, theme, tasks (Task[]), milestone (string), estimatedHours (number)
- `Task`: title, description, type (learn | do | build | network | practice), resource (string | null), deliverable (string | null)

**2. src/data/pm-roles.ts** — Define 6 PM sub-roles with detailed data:
Based on my research, these are the PM sub-roles aspirants should know about:
- Consumer PM (user-facing products, A/B testing, UX empathy)
- Growth PM (metrics, experimentation, funnel optimization)
- Technical PM (API/platform, system design, engineering credibility)
- AI/ML PM (LLM trade-offs, prompt engineering, model evaluation, shipping AI features)
- B2B/Enterprise PM (stakeholder management, sales alignment, roadmap communication)
- Platform PM (developer experience, SDK/API design, ecosystem thinking)

For each role include: which backgrounds are best suited, key skills needed, demand level in 2026 market, entry difficulty, and salary ranges.

**3. src/data/scoring-rules.ts** — Define the scoring engine rules:

The scoring should implement these research-backed rules:
- Engineers (30-40% of successful transitioners) get +15 for Technical PM, +10 for Platform PM, -5 for Growth PM (they tend to "solutionize" too early)
- Consultants get +15 for B2B/Enterprise PM, +10 for Growth PM, -10 for Technical PM (gap is technical credibility)
- Analysts get +15 for Growth PM, +10 for Consumer PM, -5 for Technical PM
- MBA grads get +10 for B2B/Enterprise PM, +10 for Consumer PM, -15 for Technical PM
- Side projects add +20 to overall fit score (78% of surveyed aspirants believe projects beat frameworks, but 44% have built nothing)
- Strategic networking adds +25 (50-70% conversion rate vs 20-30% for active preppers)
- AI experience adds +15 (78% agree AI literacy is now baseline)
- 30+ mock interviews adds +20 to readiness
- Less than 3 months prep: not_ready. 3-6: early. 6-12: developing. 12+: interview_ready (based on Lenny Rachitsky's recommendation of 12+ months)

Include gap analysis logic: for each background type, define the top 3 gaps (e.g., engineer's gaps are business framing, user empathy, stakeholder communication; consultant's gaps are technical credibility, data fluency, product intuition).

Make the scoring nuanced and honest — the assessment should be willing to output "consider_alternatives" for profiles that genuinely don't match PM, like the research says: only 7% of FAANG PMs were hired with zero prior experience.
```

### Prompt 1.2 — Build the Assessment Engine

```
Now build the actual assessment engine in src/lib/assessment-engine.ts.

Create a function `runAssessment(profile: UserProfile): AssessmentResult` that:

1. Calculates a fitScore (0-100) using weighted scoring:
   - Background match: 25 points max (how well does their background map to PM?)
   - Skills alignment: 20 points max (do they have the right skills for their target role?)
   - Experience quality: 20 points max (have they built things, managed stakeholders, used data?)
   - Preparation level: 15 points max (prep months, mocks done, side projects)
   - Network strength: 10 points max (networking level)
   - AI readiness: 10 points max (AI experience in 2026 market)

2. Determines fitVerdict based on score:
   - 75-100: strong_fit
   - 55-74: good_fit
   - 35-54: needs_work
   - 0-34: consider_alternatives

3. Ranks PM sub-roles by compatibility using the scoring rules from pm-roles.ts and scoring-rules.ts. Return top 3 matches with scores.

4. Generates gap analysis: for each of the user's top 3 gaps, return the skill name, their estimated current level (1-5), required level (1-5), priority, and a specific recommendation (not generic advice — e.g., "Complete 3 product teardowns focusing on business model analysis" not "improve business skills").

5. Calculates readiness level and estimated time-to-ready.

The engine must be honest. If someone has 1 year experience, no side projects, no networking, and targets FAANG — the score should reflect reality (cold application conversion is 0.12%). The system should not sugarcoat.

Also create src/lib/role-matcher.ts with a function `matchRoles(profile: UserProfile): PMRole[]` that returns ranked role recommendations with match percentage and explanation of why each role fits or doesn't fit.

Write comprehensive unit tests in a separate test file.
```

### Prompt 1.3 — Build the Assessment UI

```
Build the assessment intake flow UI. This is the first thing users interact with — it needs to feel professional, trustworthy, and different from generic bootcamp marketing.

Create src/app/(app)/assessment/page.tsx as a multi-step form:

**Step 1 — Background** (1 screen):
- Current role (text input)
- Professional background (select: Engineer, Analyst, Consultant, MBA, Designer, Other)
- Years of experience (number slider: 0-15)
- Highest education (select: Bachelor's, Master's/MBA, PhD, Other)

**Step 2 — Skills & Experience** (1 screen):
- Have you built a product or feature end-to-end? (yes/no)
- Have you managed cross-functional stakeholders? (yes/no)
- Have you used data to drive product decisions? (yes/no)
- Do you have experience with AI/ML tools or products? (yes/no)
- Have you completed any PM side projects or case studies? (yes/no)
- Select your strongest skills (multi-select from: SQL/Data Analysis, User Research, A/B Testing, Product Strategy, Wireframing/Design, Technical Architecture, Stakeholder Management, Market Analysis, Agile/Scrum, AI/ML Concepts)

**Step 3 — Preparation Status** (1 screen):
- How many months have you been preparing for PM? (number)
- How many mock interviews have you done? (number)
- What's your networking level? (radio: Not started / Passive LinkedIn / Active outreach / Strategic with referrals)
- Target company tier? (radio: Startup / Mid-market / Enterprise / FAANG/Top Tech)

**Step 4 — Results** (full results page):
- Overall fit score (animated circular progress indicator)
- Fit verdict with honest explanation
- Top 3 matched PM roles with compatibility percentage and reasoning
- Gap analysis table showing each gap, current vs required level, priority, and specific recommendation
- Readiness level indicator
- Estimated time to interview-ready
- CTA: "Generate My Personalised Roadmap" button

Design notes:
- Use a progress bar across the top showing steps 1-4
- Each step should animate in smoothly
- Use card-based layout for results
- The fit score should use color coding: green (75+), blue (55-74), amber (35-54), red (0-34)
- Include a small disclaimer: "This assessment is based on market research patterns. Individual outcomes vary."
- Make it feel like a premium diagnostic, not a quiz

The form should use React state to collect all answers, then call the assessment engine on submit, and display results on the same page.
```

---

## PHASE 2 — Personalised Roadmap Engine

### Prompt 2.1 — Roadmap Templates & Generator

```
Build the personalised roadmap system.

**1. src/data/roadmap-templates.ts** — Create roadmap templates for each background type:

Each template should be a 12-week plan (the research says 12+ months is ideal, but start with a structured first quarter). The roadmap varies by background:

**Engineer → PM roadmap** (gaps: business framing, user empathy, stakeholder communication):
- Weeks 1-2: Product thinking fundamentals + first product teardown (business model focus)
- Weeks 3-4: User research methods + conduct 3 user interviews on a real problem
- Weeks 5-6: Business case writing + create a product brief for a real problem
- Weeks 7-8: Stakeholder communication + practice presenting a product decision
- Weeks 9-10: Mock interview practice (minimum 5 mocks) + portfolio piece #1
- Weeks 11-12: Networking sprint (10 targeted outreach messages) + application strategy

**Consultant → PM roadmap** (gaps: technical credibility, data fluency, product intuition):
- Weeks 1-2: Technical fundamentals (APIs, databases, system design basics)
- Weeks 3-4: SQL + data analysis project using a public dataset
- Weeks 5-6: Build a simple prototype (no-code or low-code) to demonstrate product intuition
- Weeks 7-8: Product metrics deep dive + design an experimentation plan
- Weeks 9-10: Mock interview practice (minimum 5 mocks) + portfolio piece #1
- Weeks 11-12: Networking sprint + application strategy

**Analyst → PM roadmap** (gaps: strategic thinking, communication, product vision):
- Similar structure, different focus areas

**MBA → PM roadmap** (gaps: technical credibility, hands-on product work, execution speed):
- Similar structure, different focus areas

For each week, include:
- Theme (string)
- 3-5 specific tasks with type (learn/do/build/network/practice)
- A concrete deliverable (not "learn about X" but "write a 1-page product teardown of Spotify's discovery feature")
- Free resources only (YouTube links, blog posts, free tools)
- Estimated hours (8-15 hrs/week for working professionals)
- A milestone to check off

**2. src/lib/roadmap-engine.ts** — Create `generateRoadmap(profile: UserProfile, assessment: AssessmentResult): RoadmapWeek[]`:

The function should:
- Select the base template for the user's background
- Adjust based on their gap analysis (if their biggest gap is stakeholder mgmt, move those weeks earlier)
- Adjust intensity based on target company tier (FAANG prep needs more mocks)
- Add AI fluency modules if they lack AI experience (2026 market requires this)
- Include networking actions every week (not just in final weeks — research shows strategic networkers have 50-70% conversion)
- Adjust timeline if they've already done some prep (don't restart from zero)
```

### Prompt 2.2 — Roadmap UI with Progress Tracking

```
Build the roadmap display page at src/app/(app)/roadmap/page.tsx.

This page should show the user's personalised 12-week roadmap with:

1. **Roadmap overview header**:
   - "Your Personalised PM Roadmap" with their background type and target role
   - Overall progress bar (% of tasks completed)
   - Estimated completion date
   - Current week highlighted

2. **Week-by-week accordion/timeline**:
   - Each week is an expandable card
   - Shows: week number, theme, number of tasks, estimated hours, milestone
   - When expanded: shows all tasks with checkboxes
   - Each task has: title, description, type badge (Learn/Do/Build/Network/Practice in different colors), resource link, deliverable description
   - Completed tasks get a strikethrough and green checkmark

3. **Sidebar (desktop) or bottom sheet (mobile)**:
   - Readiness score (updates as tasks are completed)
   - Skills radar chart showing current vs target levels (use Recharts)
   - "Days in prep" counter
   - Next milestone

4. **Weekly action cards at the top**:
   - Show "This week's focus" with the 3 most important tasks for the current week
   - Quick-complete buttons

Store progress in localStorage for now (no backend needed for MVP). Use React state + localStorage sync.

Design: Make it feel like a premium productivity tool, not a course platform. Think Linear or Notion vibes — clean, fast, information-dense but not cluttered. The current week should be visually prominent. Past weeks should be collapsible. Future weeks should be slightly dimmed.
```

---

## PHASE 3 — Readiness Scoring & Dashboard

### Prompt 3.1 — Readiness Scorer

```
Build src/lib/readiness-scorer.ts — a dynamic scoring system that updates as the user progresses.

Create `calculateReadiness(profile: UserProfile, completedTasks: string[], weekNumber: number): ReadinessScore`:

ReadinessScore should include:
- overallScore (0-100)
- level: "not_ready" | "early_prep" | "developing" | "almost_ready" | "interview_ready"
- dimensions (object with scores for each):
  - productThinking (0-100): based on completed teardowns, case studies, product briefs
  - technicalFluency (0-100): based on completed technical tasks
  - communicationSkill (0-100): based on completed mock interviews and presentations
  - portfolioStrength (0-100): based on completed deliverables and side projects
  - networkStrength (0-100): based on networking tasks completed
  - aiFluency (0-100): based on AI-related tasks completed
  - interviewPrep (0-100): based on mock interviews done
- weeklyChange: how much the score changed this week
- nextMilestone: what they should focus on to reach the next level
- estimatedWeeksToReady: number
- honestAssessment: a 2-3 sentence candid evaluation of where they stand

The scoring should be calibrated against the research:
- Score below 30: "You're in the exploration phase. Most aspirants spend 2-4 months here."
- Score 30-50: "You're actively preparing but not yet competitive. Focus on building, not consuming."
- Score 50-70: "You have a foundation. Start targeted networking and mock interviews."
- Score 70-85: "You're approaching interview-ready. Focus on specific company prep."
- Score 85+: "You're competitive. Apply strategically — target 10-15 well-researched roles, not 50 spray-and-pray."
```

### Prompt 3.2 — Dashboard UI

```
Build src/app/(app)/dashboard/page.tsx — the main dashboard users see after completing the assessment.

Layout:
1. **Top row — Key metrics** (4 cards):
   - Readiness Score (large number with circular progress, color-coded)
   - Days in Prep (counter)
   - Tasks Completed (X of Y)
   - Current Week (with progress within the week)

2. **Middle row — Two columns**:
   - Left: "This Week's Focus" — top 3 priority tasks with quick-complete toggles
   - Right: "Skills Radar" — radar chart (Recharts) showing 6 dimensions of readiness

3. **Progress over time** (line chart):
   - X-axis: weeks
   - Y-axis: readiness score
   - Show the trajectory and projected completion date

4. **Gap analysis summary**:
   - Show top 3 gaps with progress bars (current level → target level)
   - Each gap links to the relevant roadmap week

5. **Bottom row — Quick actions**:
   - "Start Mock Interview" button → links to mock interview page
   - "Update Progress" button → opens a quick checklist modal
   - "View Full Roadmap" button → links to roadmap page

Store all data in localStorage. Read from the assessment result and roadmap progress.

Design: Dashboard should feel like a personal command center. Use the dark navy header from the design system. Cards should have subtle shadows and hover states. The readiness score should be the visual anchor — large, prominent, and honest.
```

---

## PHASE 4 — Mock Interview Practice (Free AI)

### Prompt 4.1 — Mock Interview with Gemini Free API

```
Build a mock PM interview practice feature at src/app/(app)/mock-interview/page.tsx.

This feature uses the Google Gemini API (free tier: 15 requests/minute, gemini-2.0-flash model).

**Setup:**
- Create src/lib/gemini.ts with a function to call the Gemini API
- Use the REST API directly (POST to https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY)
- Store the API key in .env.local as NEXT_PUBLIC_GEMINI_API_KEY (for client-side use in MVP; move to server-side API route for production)
- If no API key is set, fall back to a "manual mode" with pre-written feedback templates

**Interview flow:**
1. User selects interview type:
   - Product Design ("Design a product for...")
   - Product Strategy ("Should company X enter market Y?")
   - Analytical/Estimation ("How many X are there in Y?")
   - Behavioral ("Tell me about a time...")
   - AI Product ("How would you build an AI feature for...")

2. System generates a question (from src/data/interview-questions.ts — create 10 questions per category, sourced from common PM interview resources)

3. User types their answer (textarea, 500 word suggested limit, with a timer showing 5 minutes)

4. System sends to Gemini with this system prompt:
   "You are a senior PM interviewer at a top tech company. The candidate just answered a PM interview question. Evaluate their response against these 8 common failure modes identified in research:
   1. Lack of clarifying questions
   2. Talking too much / poor structure
   3. Generic answers without specifics
   4. Lack of preparation and research
   5. No product experience demonstrated
   6. Not being memorable or differentiated
   7. Missing tradeoff analysis
   8. No metrics or success criteria defined
   
   Provide:
   - Score (1-10)
   - Top 2 strengths in their answer
   - Top 2 areas to improve (be specific and actionable)
   - A brief example of what a strong answer would include
   - Which failure modes they exhibited (if any)
   
   Be honest but constructive. Don't sugarcoat."

5. Display feedback in a structured card format with the score prominently shown.

**Fallback mode (no API key):**
If Gemini is not configured, show a self-evaluation checklist instead:
- "Did I start with clarifying questions?" (yes/no)
- "Did I structure my answer clearly?" (yes/no)
- "Did I include specific examples?" (yes/no)
- "Did I discuss tradeoffs?" (yes/no)
- "Did I define success metrics?" (yes/no)
Auto-generate a score based on their self-assessment.

**UI:**
- Clean, focused interview interface — hide the navbar, show only a minimal header with a timer
- Question displayed prominently at top
- Large textarea for answer
- "Submit for Review" button
- Results appear below with animated reveal
- History of past attempts stored in localStorage
- Stats: total interviews done, average score, most common failure mode
```

---

## PHASE 5 — Landing Page & Polish

### Prompt 5.1 — Landing Page

```
Build a compelling landing page at src/app/(marketing)/page.tsx.

This is NOT a generic SaaS landing page. This page needs to speak directly to the "Truth Seeker" — the aspiring PM who has consumed content for months and is still failing at targeting and readiness.

**Hero section:**
- Headline: "Stop preparing. Start navigating."
- Subheadline: "140,000 PM roles exist. You're applying to the wrong ones. Get an honest fit assessment, a personalised roadmap, and know exactly when you're ready."
- CTA: "Take the Free Assessment" → links to /assessment
- A subtle stat bar below: "0.12% cold application conversion rate • 7x advantage with referrals • 60-70% of explorers never apply"

**Problem section:**
- Title: "The PM preparation trap"
- Three pain cards:
  1. "No honest fit verdict" — No platform tells you if PM suits YOUR background, or which type fits you specifically
  2. "Generic roadmaps fail" — An engineer's biggest gap is business framing. A consultant's is technical credibility. Generic advice helps neither.
  3. "You don't know when you're ready" — Candidates apply after 8-12 weeks. Experts recommend 12+ months. Nobody bridges this gap.

**Solution section:**
- Title: "What PM Navigator does differently"
- Four feature cards matching the solution flow:
  1. Fit Assessment — "An honest diagnostic that includes 'PM may not be right for you' as a valid answer"
  2. Personalised Roadmap — "Week-by-week plan calibrated to your background, not a generic 12-week bootcamp"
  3. Readiness Scoring — "Know exactly where you stand against actual hiring bars, not arbitrary milestones"
  4. Mock Interview Practice — "AI-powered feedback mapped to 8 proven interview failure modes"

**Social proof / data section:**
- Title: "Built on research, not marketing"
- Key stats from the discovery document:
  - "Based on analysis of 50+ sources, 150 FAANG PM transitions, and 4.5M job applications"
  - "78% believe projects beat frameworks. 44% have built nothing. We fix that gap."
  - "Strategic networkers convert at 50-70%. Our roadmap includes networking from week 1."

**CTA section:**
- "Ready to stop guessing?"
- Large "Start Free Assessment" button
- Small text: "No signup required. No credit card. Takes 3 minutes."

Design: Bold, editorial feel. Not the typical gradient-heavy SaaS template. Use Plus Jakarta Sans. Dark navy + teal accents. Plenty of whitespace. The page should feel honest and credible, not salesy.
```

---

## PHASE 6 — Database & User Accounts (When Ready)

### Prompt 6.1 — Supabase Setup

```
Add Supabase (free tier) for user authentication and data persistence.

1. Install @supabase/supabase-js and @supabase/ssr
2. Create src/lib/supabase.ts with client configuration (read NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local)
3. Create the following database tables (provide the SQL for Supabase dashboard):

   - users (managed by Supabase Auth)
   - profiles:
     - id (uuid, references auth.users)
     - background, years_experience, current_role, target_company_tier
     - created_at, updated_at
   
   - assessment_results:
     - id (uuid)
     - user_id (references profiles)
     - fit_score, fit_verdict, role_matches (jsonb), gap_analysis (jsonb)
     - readiness_level, created_at
   
   - roadmap_progress:
     - id (uuid)
     - user_id (references profiles)
     - week_number, task_id, completed (boolean)
     - completed_at
   
   - mock_interviews:
     - id (uuid)
     - user_id (references profiles)
     - question_type, question_text, answer_text
     - score, feedback (jsonb)
     - created_at

4. Add Row Level Security (RLS) policies so users can only read/write their own data.
5. Create a sign-up/sign-in page at src/app/(auth)/login/page.tsx with email + Google OAuth.
6. Create a middleware.ts that protects /dashboard, /roadmap, /mock-interview routes (redirect to /login if not authenticated).
7. Migrate all localStorage reads/writes to Supabase — keep localStorage as offline fallback.

Make the authentication optional for the assessment — users can take the assessment without signing up, but prompt them to create an account to save results.
```

---

## PHASE 7 — Deployment

### Prompt 7.1 — Production Readiness & Deploy

```
Prepare the PM Navigator app for production deployment on Vercel (free tier).

1. Add proper meta tags and SEO to the layout:
   - Title: "PM Navigator — Career Navigation for Aspiring Product Managers"
   - Description: "Get an honest PM fit assessment, a personalised roadmap, and know exactly when you're interview-ready. Built on research from 50+ sources."
   - Open Graph image (create a simple OG image component using @vercel/og)

2. Add a loading.tsx skeleton for each route

3. Add error.tsx error boundaries for each route

4. Optimise for Core Web Vitals:
   - Lazy load Recharts components
   - Use next/image for any images
   - Add proper font loading with next/font

5. Add a simple analytics setup using Vercel Analytics (free)

6. Create a vercel.json if needed

7. Add environment variable instructions in README.md:
   - NEXT_PUBLIC_GEMINI_API_KEY (optional — mock interviews work without it)
   - NEXT_PUBLIC_SUPABASE_URL (optional — app works with localStorage without it)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY (optional)

8. Write a comprehensive README.md with:
   - Project description
   - Tech stack
   - Local development setup
   - Environment variables
   - Deployment instructions
   - Architecture overview

The app should work fully with zero environment variables configured (all features fall back to client-side localStorage and manual mode). This means anyone can clone, npm install, npm run dev, and have a working app immediately.

Provide the exact commands to deploy to Vercel.
```

---

## BONUS PROMPTS

### Prompt B.1 — Portfolio / Proof-of-Work Templates

```
Add a "Build Your Portfolio" section at src/app/(app)/portfolio/page.tsx.

The research shows 78% of aspirants believe projects beat frameworks, but 44% have built nothing. This feature gives them structured templates.

Create 5 portfolio piece templates:
1. Product Teardown Template — structured framework for analyzing an existing product (what problem it solves, how it works, what could improve, business model analysis)
2. Feature Spec Template — a mini-PRD template for proposing a new feature
3. Case Study Template — framework for documenting a product problem they solved (even from their current non-PM role)
4. Market Analysis Template — template for analyzing a market opportunity
5. AI Product Proposal Template — template for proposing an AI-powered feature (calibrated to 2026 expectations)

Each template should be:
- An interactive form that guides them through each section
- Exportable as a Markdown file they can put on their portfolio
- Scored against a checklist (completeness, depth, originality)

This directly addresses the "knowledge without action" pain point — giving them a structured starting point so the blank page doesn't win.
```

### Prompt B.2 — Networking Tracker

```
Add a networking tracker feature since referrals are 7x more effective than cold applications, yet 80%+ of aspirants spend prep time on content instead.

Create src/app/(app)/networking/page.tsx with:

1. A "PM Network Map" showing:
   - Target contacts (name, company, role, connection strength: cold/warm/hot)
   - Outreach status (not contacted / reached out / replied / had call / referral secured)
   - Follow-up reminders

2. Outreach templates for:
   - Cold LinkedIn message to a PM at target company
   - Warm intro request to mutual connection
   - Coffee chat follow-up email
   - Referral request after building relationship

3. Weekly networking goals:
   - "Send 3 targeted outreach messages this week"
   - "Follow up with 2 existing connections"
   - "Share 1 product insight on LinkedIn"

4. Stats dashboard:
   - Total contacts in network
   - Response rate
   - Calls completed
   - Referrals secured

Store everything in localStorage. This feature converts "I know networking matters" into "here's exactly what to do today."
```

### Prompt B.3 — Swap Gemini for Groq (Alternative Free AI)

```
Create an alternative AI provider using Groq (free, faster inference than Gemini).

1. Create src/lib/groq.ts alongside the existing gemini.ts
2. Use the Groq REST API (POST to https://api.groq.com/openai/v1/chat/completions) with model "llama-3.1-70b-versatile"
3. Create a unified src/lib/ai-provider.ts that:
   - Reads AI_PROVIDER from .env.local (values: "gemini" | "groq" | "none")
   - Routes to the correct provider
   - Falls back to manual mode if neither is configured
4. Update the mock interview feature to use the unified provider
5. Add instructions in README for getting a free Groq API key from https://console.groq.com

This way users can choose whichever free provider they prefer.
```

---

## Execution Order Summary

| Phase | What You Build | Time Estimate | Dependencies |
|-------|---------------|---------------|-------------|
| 0 | Project setup | 30 min | Node.js |
| 1 | Assessment engine + UI | 1-2 days | Phase 0 |
| 2 | Roadmap engine + UI | 1-2 days | Phase 1 |
| 3 | Dashboard + readiness | 1 day | Phase 1-2 |
| 4 | Mock interviews (AI) | 1 day | Phase 0, free Gemini key |
| 5 | Landing page | 0.5 day | Phase 0 |
| 6 | Supabase (optional) | 0.5 day | Phase 1-3 |
| 7 | Deploy to Vercel | 30 min | All phases |
| B.1 | Portfolio templates | 0.5 day | Phase 0 |
| B.2 | Networking tracker | 0.5 day | Phase 0 |
| B.3 | Groq alternative | 30 min | Phase 4 |

**Total: ~5-7 working days for a fully functional, deployed MVP**

---

## Tips for Using These Prompts

1. **Run each prompt in a fresh Claude chat** (or continue in the same one if context permits). Upload the Product Discovery Document for context.
2. **Test each phase before moving on.** Run `npm run dev` and verify the feature works.
3. **If a prompt produces errors**, paste the error message and ask Claude to fix it.
4. **Customize the data.** The scoring rules and roadmap templates are based on the research — adjust the weights and content based on your team's insights.
5. **Start with Phase 0-1-5-7.** This gives you a deployable app (assessment + landing page) in 2-3 days. Add other phases incrementally.

---

*Generated from: PM Career Navigation Platform — Product Discovery Document, March 2026*
*Research base: 70+ sources, 50+ primary citations, 4 user interviews, 8 research pillars*
