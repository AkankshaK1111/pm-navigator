# PM Navigator — Product Presentation

---

## Slide 1: Title

**PM Navigator**
*"Like Google Maps, but for your PM career."*

A personalized career navigation platform for aspiring Product Managers.

---

## Slide 2: The Problem

**Aspiring PMs are lost.**

> "Aspiring product managers globally lack a structured, personalized path from 'I want to be a PM' to 'I am ready to apply and here's why.'"

- The market provides **resources** but not **navigation**
- It provides **frameworks** but not **feedback**
- It provides **community** but not **calibrated signal**

**Result:** 12–18 months of low-feedback preparation cycles, high rejection rates, and significant financial and emotional cost.

---

## Slide 3: The India Problem (Beachhead)

| Metric | Data |
|--------|------|
| Active PM aspirants/year | 50,000–80,000 |
| Annual junior PM openings | 2,000–3,500 |
| Oversubscription ratio | **15–25x** |
| Average prep time | 12–18 months |
| Feedback after rejection | **Zero** |

Aspiring PMs bounce between YouTube, PM School cohorts, and WhatsApp prep groups — without ever knowing where they stand relative to what **Flipkart, Meesho, or CRED** actually wants.

---

## Slide 4: Discovery — How We Validated

### Research Base
- **70+ sources** analyzed across India and North America
- **4 user interviews** with career switchers
- **150 FAANG PM transitions** studied
- **4.5M job applications** analyzed in aggregate
- **12 Indian tech companies** hiring bars mapped with real data

### Three Pain Points Ranked (by user severity)

| Rank | Pain Point | Evidence |
|------|-----------|----------|
| 1 | **No structured, personalized path** | Users get lists of resources without sequence or assessment |
| 2 | **Uncalibrated feedback** | Mock interview peers give contradictory feedback |
| 3 | **No readiness signal** | No go/no-go indicator — causing premature applications AND over-preparation |

---

## Slide 5: Discovery — Key Insights

### 1. The Hiring Manager's Wall
> *"I've hired for PMs at 2 unicorns. I never got any CVs from a PM bootcamp. Not one."*
— Flipkart hiring manager

### 2. Network Problem Disguised as Skills Problem
Cold application conversion: **<0.12%**. Referrals: **7x advantage**.

### 3. The Analytical Gap Nobody Warns About
Courses teach product sense. Companies **test analytical depth**. This mismatch causes most late-stage rejections.

### 4. Preparation Communities Are a Trap
100+ resources shared weekly. More consumption masking zero progress. No feedback loop — infinite resource loop.

### 5. AI PM Is the Unserved White Space
14,000+ AI PM openings globally. 75% of employers can't find qualified candidates. **No platform teaches AI PM skills.**

---

## Slide 6: Competitive Landscape — The Gaps

| Competitor | What They Do | What's Missing |
|---|---|---|
| **Exponent** | Interview prep templates, peer mocks | No personalization. Feedback uncalibrated. No readiness signal. |
| **PM School** (Acquired by NextLeap) | Cohort-based 16-week program | Cohort-only. No persistent scoring. Acquired = market gap opened. |
| **Product Space** | 100K+ community | No structured guidance. No diagnostic. |
| **Reforge** | Advanced PM frameworks | $1,995/yr. NOT for aspirants. Mid/senior only. |
| **Lenny's Newsletter** | Content + 1M subscribers | Advisory, not structured. No guided path. |

### Four White Space Gaps — No One Solves These

1. **Personalized gap diagnosis** — "here's where YOU are weak"
2. **Calibrated feedback at scale** — consistent, expert-benchmarked
3. **Objective readiness signal** — go/no-go before you apply
4. **Post-rejection remediation** — rejection → specific gap → targeted fix

---

## Slide 7: Prioritization — Strategic Decisions

| Decision | Choice | Why |
|---|---|---|
| **Beachhead market** | India first | Lower CAC, weaker competition, coaching culture, PM School acquisition opened a gap |
| **Business model** | Freemium subscription | Aligns revenue with user success across 6–18 month journey |
| **Core differentiator** | PM Readiness Score + Remediation Loop | Doesn't exist anywhere. Most-cited missing element. |
| **Architecture** | One core engine, two market skins | Same gap-diagnosis logic; localized content for India vs. NA |

### Pricing (validated against WTP research)
- **Free:** Diagnosis (assessment + readiness score)
- **Paid:** Navigation (roadmap + daily tasks + AI coaching)
- Sweet spot: **INR 8,000–15,000/year** (~$96–$180)
- WTP ceiling: INR 40,000 (~$480)

---

## Slide 8: Prioritization — Feature Ranking

### MoSCoW Prioritization

| Priority | Feature | Rationale |
|---|---|---|
| **Must Have** | AI Readiness Score (6 dimensions) | Core differentiator. No competitor has this. |
| **Must Have** | Curated Market Data (12 companies, hiring bars) | Powers all intelligence features. Data moat. |
| **Must Have** | Resume Parsing + Gate Task | Input layer — scoring needs evidence from user. |
| **Should Have** | Daily Task Scoring (6 rubric types) | Remediation loop — how users improve scores. |
| **Should Have** | North AI Chat (floating assistant) | Engagement driver. Personalized guidance at every step. |
| **Should Have** | Job Intelligence (matching + listings + trends) | Connects readiness to real opportunities. |
| **Could Have** | Post-Rejection Agent (agentic AI) | High-impact for retained users. Emotional hook. |
| **Won't Have (v1)** | Peer matching / cohorts | Cold start problem. Needs critical mass first. |

---

## Slide 9: Solutioning — The Core Engine

### The PM Readiness Score — How It Works

**6 AI-Scored Dimensions** (calibrated against real company hiring bars):

| Dimension | Weight | What It Measures |
|---|---|---|
| Product Sense | 25% | User empathy, problem framing, prioritization |
| Analytical Depth | 20% | Metric reasoning, data-driven decisions |
| Business Framing | 15% | Commercial awareness, market thinking |
| Technical Credibility | 15% | Engineering fluency, system thinking |
| AI Fluency | 10% | AI/ML understanding, AI product thinking |
| Behavioural | 15% | Leadership, collaboration, conflict resolution |

### How Scoring Works
1. **Background baselines** — Starting ranges per background type (engineers start high on Technical, low on Business)
2. **Evidence from resume** — AI parses PDF, extracts PM-relevant signals
3. **Evidence from gate task** — Live writing sample scored against rubric
4. **Cross-validation rules** — Gate score <40 → Product Sense capped at 55
5. **Calibration examples** — AI is shown 3 benchmark profiles to prevent score inflation

**Result:** Most career switchers score 30–65. Only genuine evidence pushes above 80.

---

## Slide 10: Solutioning — The Intelligence Layer

### Curated Market Data (Our Data Moat)

Manually researched and verified dataset powering all AI features:

| Data | Count | What It Contains |
|---|---|---|
| **Companies** | 12 | Hiring bars (6 dimensions), interview format, rejection reasons, salary ranges, switcher-friendliness |
| **Job Listings** | 24 | Required dimension scores, fit calculation against user scores |
| **Market Trends** | 8 | Personalized signals (AI hiring surge, fintech growth, etc.) |
| **Transition Profiles** | 6 | Conversion rates by background type, avg time to offer, best-fit companies |

### How It Powers Features

```
User Profile + Readiness Scores
        ↓
  Market Data (RAG)  ←→  AI Model
        ↓
  Personalized Output
  (job matches, gap diagnosis, recovery plans)
```

Every AI response is grounded in **real data** — not generic PM advice.

---

## Slide 11: Solutioning — Architecture

### Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| AI Engine | Groq (Llama 3.3 70B) — free tier, fast inference |
| Auth | Supabase (Google OAuth + email/password) |
| Database | Supabase PostgreSQL + localStorage (hybrid) |
| PDF Parsing | PDF.js (client-side, first 3 pages) |
| Hosting | Vercel (auto-deploy from GitHub) |
| Data | Curated JSON dataset (50 embedded items) |

### AI Architecture Decision

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Server-side API calls | Secure, key hidden | Needs serverless functions | For production |
| Client-side SDK | Faster to build, no backend | Key exposed in bundle | **For prototype** |

**Current:** Client-side with Groq SDK. Before public launch: move all AI calls to Vercel serverless functions.

---

## Slide 12: Feature Walkthrough — User Flow

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  Assessment  │───→│   Gate Task   │───→│  Readiness   │
│  (5 questions)│    │  (AI-scored)  │    │   Score      │
└─────────────┘    └──────────────┘    │  (6 dims)    │
                                        └──────┬───────┘
                                               │
                    ┌──────────────────────────┼──────────────────────┐
                    ↓                          ↓                      ↓
            ┌──────────────┐         ┌──────────────┐       ┌──────────────┐
            │   Roadmap    │         │    Jobs      │       │  Dashboard   │
            │ (12 weeks)   │         │ (AI matches) │       │ (daily tasks)│
            └──────────────┘         └──────────────┘       └──────────────┘
                    │                                                │
                    ↓                                                ↓
            ┌──────────────┐                                ┌──────────────┐
            │ Daily Tasks  │                                │ North Chat   │
            │ (AI-scored)  │                                │ (AI guide)   │
            └──────────────┘                                └──────────────┘
                                                                     │
                                                            ┌──────────────┐
                                                            │  Rejection   │
                                                            │    Agent     │
                                                            └──────────────┘
```

---

## Slide 13: Feature — Resume Parsing

### What It Does
User uploads PDF resume → AI extracts structured PM-relevant data

### How It Works
1. **PDF.js** extracts text client-side (first 3 pages)
2. **AI** parses text with PM-specific prompt
3. Returns: name, role, experience, skills, and **4 PM Highlights**

### PM Highlights (unique differentiator)
Each highlight is classified as:
- **Strength** (↑) — signals PM readiness (e.g., "Led cross-functional team of 8 to ship payment feature")
- **Warning** (⚠) — needs reframing (e.g., "Service company experience — no product ownership signals")
- **Action** (→) — something to build (e.g., "No user research evidence — add a case study to portfolio")

---

## Slide 14: Feature — Gate Task (First Action)

### What It Does
User writes a 1500-character product teardown → AI scores it in real-time

### The Prompt
> Pick any app feature. Answer:
> 1. Who is this feature for?
> 2. What problem does it solve?
> 3. How would you know if it's working?
> 4. What would you change — and why?

### Scoring Rubric
| Band | Criteria |
|------|----------|
| 80–100 | Grounds in user + names real problem + proposes measurable change |
| 60–79 | Shows product instinct but one dimension weak |
| 40–59 | Leads with solution before diagnosing problem |
| 0–39 | Too generic or vague |

### Output
- **Score** (0–100)
- **Thinking Style** (user-first / metric-first / solution-first / problem-first)
- **Headline** ("Thinks in features, not user outcomes")
- **Strength** (referencing their actual words)
- **Gap** (referencing their actual words)

---

## Slide 15: Feature — AI Readiness Score

### The Most Valuable Feature — No Competitor Has This

**Input:** Background + Resume + Gate Task Score
**Output:** 6-dimension radar chart with calibrated scores

### Calibration System (prevents AI score inflation)
1. **Background baselines** — Engineers start at 70–85 Technical, 25–35 Business
2. **Cross-validation rules** — Gate <40 → Product Sense capped at 55
3. **Calibration examples** — AI shown 3 benchmark profiles before scoring
4. **Scoring bands** — Most switchers score 30–65. All 6 above 50 = likely inflated.
5. **Evidence-only scoring** — Each dimension note must reference specific user data

### Company Comparison
User scores are compared against **real hiring bars** from 12 Indian companies:
- Razorpay requires Product Sense 75, Analytical 80
- Meesho requires Product Sense 65, Technical 50
- User sees: "Your Analytical Depth (44) is 36 points below Razorpay's bar (80)"

---

## Slide 16: Feature — Daily Task Scoring

### 17 Practice Tasks Across 6 Types

| Task Type | Dimension Targeted | Example |
|---|---|---|
| Product Teardown | Product Sense | "Tear down {company}'s checkout flow" |
| Metric Diagnosis | Analytical Depth | "{company}'s daily active users dropped 15%..." |
| Business Case | Business Framing | "Should {company} launch a B2B product?" |
| Technical Tradeoff | Technical Credibility | "Build vs. buy for {company}'s recommendation engine" |
| AI Feature Design | AI Fluency | "Design an AI feature for {company}'s search" |
| Stakeholder Conflict | Behavioural | "Engineering says 3 sprints, sales promised 2 weeks..." |

### Smart Task Selection
- Targets user's **2–3 weakest dimensions**
- Personalizes with **target company name** ({company} → "Razorpay")
- Scores with **type-specific rubrics**
- Updates dimension scores: excellent response = +3 to +5 points

---

## Slide 17: Feature — Job Intelligence

### Three Tabs

**1. AI Matches** (personalized)
- Compares user readiness scores against company hiring bars
- Returns 4 best-fit jobs with % match and specific gap notes
- Uses transition intelligence: "Engineers convert at 12% at Meesho vs 4% at Razorpay"

**2. All Listings** (math-based, instant)
- 24 curated job listings with required dimension scores
- Fit % = user score / required score per dimension, averaged
- Visual dimension comparison chips (green = met, red = gap)

**3. Market Trends** (personalized signals)
- 4 trend signals grounded in real market data
- Color-coded: positive (green), warning (amber), negative (red)
- References user's specific gaps and target company

---

## Slide 18: Feature — North AI Chat

### Your PM Career Guide — Always Available

**Floating compass bubble** on every page. 5 quick-reply chips:
- "I'm feeling stuck"
- "How am I doing?"
- "What to do today?"
- "I got rejected" → triggers Rejection Agent
- "Mock Interview"

### What Makes North Different
- **Not a cheerleader.** Never says "great question!"
- **Specific to YOUR data** — references actual scores, gaps, background
- **Grounded in real market data** — uses keyword RAG to pull company hiring bars, transition intelligence
- **2–4 sentences max** — signal, not motivation
- **Addresses by first name** — builds trust

### Intelligence Layer (RAG)
Every message includes:
- User's readiness scores, gate score, resume highlights
- Target company hiring bar (keyword-matched from curated dataset)
- Transition intelligence for user's background type

---

## Slide 19: Feature — Post-Rejection Agent

### Multi-Step Agentic AI — The Feature No One Else Has

When user clicks **"I got rejected"**:

```
Step 1: IDENTIFY
  → AI extracts company name + interview round from user message

Step 2: RETRIEVE
  → Keyword search pulls company's hiring bar from curated dataset

Step 3: DIAGNOSE
  → Compares user's scores vs. company's bar
  → Identifies primary and secondary root causes with actual numbers
  → "Your Analytical Depth (44) was 36 points below Razorpay's bar (80)"

Step 4: GENERATE
  → 2-week day-by-day recovery plan
  → Week 1: Biggest gap (5 daily exercises with deliverables)
  → Week 2: Second gap + integration practice
  → Each day: specific task + expected output + time estimate
```

### Why This Matters
Every other platform stops at "better luck next time." PM Navigator turns rejection into a **personalized remediation plan** grounded in the exact hiring bar the user failed against.

---

## Slide 20: The Remediation Loop — Our Core Differentiator

```
    ┌──────────────────────────────────────────────┐
    │                                              │
    ↓                                              │
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│ ASSESS │───→│ SCORE  │───→│PRACTICE│───→│ APPLY  │
│Resume  │    │6 dims  │    │Daily   │    │Job     │
│Gate    │    │vs bars │    │tasks   │    │matches │
└────────┘    └────────┘    └────────┘    └───┬────┘
                                              │
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              ┌──────────┐        ┌──────────┐
                              │  OFFER!  │        │ REJECTED │
                              └──────────┘        └────┬─────┘
                                                       │
                                                       ↓
                                                ┌──────────┐
                                                │ DIAGNOSE │
                                                │ + 2-week │
                                                │   plan   │
                                                └────┬─────┘
                                                     │
                                                     └──→ Back to PRACTICE
```

**This loop doesn't exist anywhere else.** Every platform is linear (learn → apply → hope). We close the loop.

---

## Slide 21: Metrics & Validation Plan

### Success Metrics (MVP Phase)

| Metric | Target | Why It Matters |
|---|---|---|
| Assessment completion rate | >60% | Are users engaged enough to finish? |
| Gate task submission rate | >40% | Will users do the work, not just consume? |
| Return visits (D7) | >25% | Does the roadmap bring them back? |
| Daily task completion | 3+/week | Is the practice loop working? |
| North chat engagement | >2 msgs/session | Is the AI guide useful? |
| NPS | >40 | Would they recommend it? |

### Validation Plan
1. **Phase 1:** 5–10 real users (share prototype link)
2. **Phase 2:** Measure completion rates across the funnel
3. **Phase 3:** Interview 3 users who completed gate task — what surprised them?
4. **Phase 4:** A/B test readiness score presentation (radar vs. cards vs. single number)

---

## Slide 22: Business Model

### Freemium Subscription

| Tier | What's Included | Price |
|---|---|---|
| **Free** | Assessment + Readiness Score + Gate Task + 3 daily tasks | ₹0 |
| **Pro** | Full roadmap + unlimited tasks + North AI + Job matches + Rejection agent | ₹999/month or ₹7,999/year |

### Unit Economics Target

| Metric | Target |
|---|---|
| Free → Pro conversion | 5–8% |
| Monthly churn | <8% |
| LTV | ₹15,000–24,000 |
| CAC | ₹1,500–3,000 |
| LTV:CAC ratio | >5x |

### Revenue Path
- 10,000 free users → 500–800 paid → ₹40–65 lakh ARR (Year 1 target)

---

## Slide 23: Roadmap — What's Next

| Timeline | Milestone |
|---|---|
| **Now** | Working prototype with all AI features live |
| **Next 2 weeks** | User validation with 5–10 real career switchers |
| **Month 1** | Move AI calls to serverless (security), payment integration |
| **Month 2** | Interview Room (AI mock interviews with Riva) |
| **Month 3** | Peer matching, community features |
| **Month 4** | North America market skin |
| **Month 6** | pgvector semantic search for deeper RAG |

---

## Slide 24: Why Now?

1. **PM School acquired by NextLeap** (Feb 2025) — market consolidation created a gap
2. **AI PM hiring explosion** — 14,000+ openings, no training exists
3. **AI commoditized framework content** — ChatGPT can generate CIRCLES breakdowns. **Personalized diagnosis can't be commoditized.**
4. **India's PM aspirant pool is growing 25–35% YoY** — market is expanding
5. **AI inference costs dropped 90%** — features that cost $1/user/month in 2023 now cost $0.05

---

## Slide 25: Summary

**PM Navigator** is a personalized career navigation platform for aspiring Product Managers.

**What makes it different:**
- **Readiness Score** — 6 AI-calibrated dimensions benchmarked against real company hiring bars
- **Remediation Loop** — rejection → diagnosis → 2-week recovery plan (no one else does this)
- **Grounded in Real Data** — 12 companies, 24 jobs, 8 trends, 6 transition profiles
- **AI That's Specific, Not Generic** — every response references YOUR scores, YOUR gaps, YOUR target company

**The market provides resources. We provide navigation.**

---

*Built with React + TypeScript + Groq AI + Supabase*
*Data: 70+ sources, 12 company hiring bars, 150 FAANG transitions analyzed*
