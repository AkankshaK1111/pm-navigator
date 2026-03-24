import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/src/components/ui/Card';
import {
  UserProfile,
  AssessmentResult,
  Background,
  CompanyTier,
  NetworkingLevel,
  Gap,
  RoleMatch,
} from '@/src/types';
import { runAssessment } from '@/src/lib/assessment-engine';
import { saveProfileToSupabase, saveAssessmentToSupabase } from '@/src/lib/supabase-storage';
import { enhanceAssessmentWithAI, isGeminiConfigured } from '@/src/lib/gemini';
import { useAuth } from '@/src/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Target,
  Award,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Map,
  User,
  Briefcase,
  Brain,
  Loader2,
  Wand2,
  Quote,
  Lightbulb,
} from 'lucide-react';

type AIInsights = {
  aiPersonalityFit: string;
  aiStrengths: string[];
  aiWeaknesses: string[];
  aiRecommendations: string[];
  aiCareerNarrative: string;
};

const SKILLS_OPTIONS = [
  'SQL/Data Analysis',
  'User Research',
  'A/B Testing',
  'Product Strategy',
  'Wireframing/Design',
  'Technical Architecture',
  'Stakeholder Management',
  'Market Analysis',
  'Agile/Scrum',
  'AI/ML Concepts',
];

const STEPS = ['Background', 'Skills & Experience', 'Preparation', 'Results'];

function getDefaultProfile(): UserProfile {
  return {
    name: '',
    currentRole: '',
    background: 'engineer',
    yearsExperience: 3,
    education: 'bachelors',
    skills: [],
    targetCompanyTier: 'midmarket',
    hasBuiltProducts: false,
    hasManagedStakeholders: false,
    hasUsedDataForDecisions: false,
    hasAIExperience: false,
    hasSideProjects: false,
    prepMonths: 0,
    mockInterviewsDone: 0,
    networking: 'none',
  };
}

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const navigate = useNavigate();
  const { refreshProgress } = useAuth();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      // Run rule-based assessment immediately
      const assessment = runAssessment(profile);
      setResult(assessment);
      saveProfileToSupabase(profile);
      saveAssessmentToSupabase(assessment);
      refreshProgress();
      setStep(3);

      // Fire AI enhancement in the background — non-blocking
      if (isGeminiConfigured()) {
        setAiLoading(true);
        setAiError(false);
        enhanceAssessmentWithAI(profile, assessment)
          .then(insights => {
            if (insights) {
              setAiInsights(insights);
            } else {
              setAiError(true);
            }
          })
          .catch(() => setAiError(true))
          .finally(() => setAiLoading(false));
      }
    }
  };

  const handleBack = () => {
    if (step > 0 && step < 3) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 0) return profile.name.trim() !== '' && profile.currentRole.trim() !== '';
    return true;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-blue-500';
    if (score >= 35) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-blue-500';
    if (score >= 35) return 'text-amber-500';
    return 'text-red-500';
  };

  const getVerdictLabel = (verdict: string) => {
    const map: Record<string, { label: string; color: string }> = {
      strong_fit: { label: 'Strong Fit', color: 'bg-green-100 text-green-700' },
      good_fit: { label: 'Good Fit', color: 'bg-blue-100 text-blue-700' },
      needs_work: { label: 'Needs Work', color: 'bg-amber-100 text-amber-700' },
      consider_alternatives: { label: 'Consider Alternatives', color: 'bg-red-100 text-red-700' },
    };
    return map[verdict] || { label: verdict, color: 'bg-gray-100 text-gray-700' };
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'critical') return 'bg-red-100 text-red-700';
    if (priority === 'important') return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        {step < 3 && (
          <div className="mb-10">
            <div className="flex justify-between mb-3">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    i <= step ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                className="h-full bg-accent"
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 0: Background */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Tell us about yourself</CardTitle>
                  </div>
                  <CardDescription>We'll use this to calibrate your assessment against real PM hiring patterns.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                        placeholder="Your name"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Current Role</label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all"
                        placeholder="e.g. Software Engineer at Google"
                        value={profile.currentRole}
                        onChange={e => setProfile({ ...profile, currentRole: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Professional Background</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(
                        [
                          { value: 'engineer', label: 'Engineer' },
                          { value: 'analyst', label: 'Analyst' },
                          { value: 'consultant', label: 'Consultant' },
                          { value: 'mba', label: 'MBA' },
                          { value: 'designer', label: 'Designer' },
                          { value: 'other', label: 'Other' },
                        ] as { value: Background; label: string }[]
                      ).map(bg => (
                        <button
                          key={bg.value}
                          onClick={() => setProfile({ ...profile, background: bg.value })}
                          className={`p-3 text-sm font-bold rounded-lg border transition-all ${
                            profile.background === bg.value
                              ? 'bg-accent border-accent text-white shadow-md'
                              : 'bg-background border-border hover:border-accent text-muted-foreground'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Years of Experience</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="15"
                          value={profile.yearsExperience}
                          onChange={e => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) })}
                          className="flex-1 accent-accent"
                        />
                        <span className="text-lg font-bold text-primary w-8 text-center">
                          {profile.yearsExperience}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Highest Education</label>
                      <select
                        value={profile.education}
                        onChange={e => setProfile({ ...profile, education: e.target.value as any })}
                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                      >
                        <option value="bachelors">Bachelor's</option>
                        <option value="masters_mba">Master's / MBA</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Skills & Experience */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Skills & Experience</CardTitle>
                  </div>
                  <CardDescription>Be honest — the assessment works best with accurate inputs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Yes/No Questions */}
                  <div className="space-y-4">
                    {[
                      { key: 'hasBuiltProducts', label: 'Have you built a product or feature end-to-end?' },
                      { key: 'hasManagedStakeholders', label: 'Have you managed cross-functional stakeholders?' },
                      { key: 'hasUsedDataForDecisions', label: 'Have you used data to drive product decisions?' },
                      { key: 'hasAIExperience', label: 'Do you have experience with AI/ML tools or products?' },
                      { key: 'hasSideProjects', label: 'Have you completed any PM side projects or case studies?' },
                    ].map(q => (
                      <div key={q.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border">
                        <span className="text-sm font-medium text-primary">{q.label}</span>
                        <div className="flex gap-2">
                          {[true, false].map(val => (
                            <button
                              key={String(val)}
                              onClick={() => setProfile({ ...profile, [q.key]: val })}
                              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                (profile as any)[q.key] === val
                                  ? val
                                    ? 'bg-accent border-accent text-white'
                                    : 'bg-primary border-primary text-white'
                                  : 'bg-background border-border text-muted-foreground hover:border-accent'
                              }`}
                            >
                              {val ? 'Yes' : 'No'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills Multi-select */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Select your strongest skills</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_OPTIONS.map(skill => (
                        <button
                          key={skill}
                          onClick={() => {
                            const skills = profile.skills.includes(skill)
                              ? profile.skills.filter(s => s !== skill)
                              : [...profile.skills, skill];
                            setProfile({ ...profile, skills });
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                            profile.skills.includes(skill)
                              ? 'bg-accent border-accent text-white shadow-sm'
                              : 'bg-background border-border text-muted-foreground hover:border-accent'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preparation Status */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle className="text-2xl text-primary">Preparation Status</CardTitle>
                  </div>
                  <CardDescription>Where are you in your PM preparation journey?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Months preparing for PM</label>
                      <input
                        type="number"
                        min="0"
                        max="36"
                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                        value={profile.prepMonths}
                        onChange={e => setProfile({ ...profile, prepMonths: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-primary">Mock interviews done</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none"
                        value={profile.mockInterviewsDone}
                        onChange={e => setProfile({ ...profile, mockInterviewsDone: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Networking Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          { value: 'none', label: 'Not started', desc: 'Haven\'t reached out to anyone yet' },
                          { value: 'passive', label: 'Passive LinkedIn', desc: 'Engaging with PM content online' },
                          { value: 'active', label: 'Active outreach', desc: 'Sending messages and having calls' },
                          { value: 'strategic', label: 'Strategic with referrals', desc: 'Building relationships for referrals' },
                        ] as { value: NetworkingLevel; label: string; desc: string }[]
                      ).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setProfile({ ...profile, networking: opt.value })}
                          className={`p-4 text-left rounded-xl border transition-all ${
                            profile.networking === opt.value
                              ? 'bg-accent/10 border-accent shadow-sm'
                              : 'bg-background border-border hover:border-accent'
                          }`}
                        >
                          <div className={`text-sm font-bold ${profile.networking === opt.value ? 'text-accent' : 'text-primary'}`}>
                            {opt.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Target Company Tier</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(
                        [
                          { value: 'startup', label: 'Startup' },
                          { value: 'midmarket', label: 'Mid-Market' },
                          { value: 'enterprise', label: 'Enterprise' },
                          { value: 'faang', label: 'FAANG / Top Tech' },
                        ] as { value: CompanyTier; label: string }[]
                      ).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setProfile({ ...profile, targetCompanyTier: opt.value })}
                          className={`p-3 text-sm font-bold rounded-lg border transition-all ${
                            profile.targetCompanyTier === opt.value
                              ? 'bg-accent border-accent text-white shadow-md'
                              : 'bg-background border-border hover:border-accent text-muted-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Score + Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 flex flex-col items-center justify-center p-8 text-center border-none shadow-xl">
                  <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                      <circle
                        cx="72"
                        cy="72"
                        r="64"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={402}
                        strokeDashoffset={402 - (402 * result.fitScore) / 100}
                        strokeLinecap="round"
                        className={`${getScoreStroke(result.fitScore)} transition-all duration-1000`}
                      />
                    </svg>
                    <span className={`absolute text-4xl font-extrabold ${getScoreColor(result.fitScore)}`}>
                      {result.fitScore}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary">PM Fit Score</h3>
                  <span className={`mt-2 px-4 py-1 rounded-full text-xs font-bold ${getVerdictLabel(result.fitVerdict).color}`}>
                    {getVerdictLabel(result.fitVerdict).label}
                  </span>
                </Card>

                <div className="md:col-span-2 space-y-4">
                  <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-primary text-lg">
                        <CheckCircle2 className="w-5 h-5 text-accent" /> Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-primary text-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-500" /> Areas for Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Personality Fit */}
              <Card className="bg-accent/5 border-accent/20 shadow-none">
                <CardContent className="p-6">
                  <p className="text-sm text-primary leading-relaxed italic">"{result.personalityFit}"</p>
                </CardContent>
              </Card>

              {/* AI-Enhanced Insights */}
              {(aiLoading || aiInsights || aiError) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-accent" /> AI-Enhanced Insights
                    {aiLoading && <Loader2 className="w-4 h-4 text-accent animate-spin" />}
                  </h3>

                  {aiLoading && !aiInsights && (
                    <Card className="border-none shadow-md overflow-hidden">
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-4 bg-secondary rounded-full animate-pulse" style={{ width: `${85 - i * 15}%` }} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Gemini is analyzing your profile...</p>
                      </CardContent>
                    </Card>
                  )}

                  {aiError && !aiInsights && (
                    <Card className="border-none shadow-sm bg-amber-50">
                      <CardContent className="p-4">
                        <p className="text-xs text-amber-700">AI enhancement unavailable. Your rule-based assessment above is complete and accurate.</p>
                      </CardContent>
                    </Card>
                  )}

                  {aiInsights && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      {/* Career Narrative */}
                      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 shadow-none">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Quote className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Your PM Career Narrative</div>
                              <p className="text-sm text-primary leading-relaxed">{aiInsights.aiCareerNarrative}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI Personality Fit */}
                      <Card className="border-none shadow-md">
                        <CardContent className="p-6">
                          <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">AI Personality Assessment</div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{aiInsights.aiPersonalityFit}</p>
                        </CardContent>
                      </Card>

                      {/* AI Strengths + Weaknesses side by side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-primary text-base">
                              <CheckCircle2 className="w-4 h-4 text-green-500" /> AI-Identified Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {aiInsights.aiStrengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-primary text-base">
                              <AlertTriangle className="w-4 h-4 text-amber-500" /> AI-Identified Gaps
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {aiInsights.aiWeaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* AI Recommendations */}
                      <Card className="border-none shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-primary text-lg">
                            <Lightbulb className="w-5 h-5 text-accent" /> Personalised Next Steps
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {aiInsights.aiRecommendations.map((rec, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                                <span className="text-xs font-extrabold text-accent bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                                  {i + 1}
                                </span>
                                <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Top Role Matches */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" /> Your Top PM Role Matches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.roleMatches.map((rm, i) => (
                    <Card key={rm.role.id} className={`border-none shadow-md ${i === 0 ? 'ring-2 ring-accent/30' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base text-primary">{rm.role.name}</CardTitle>
                          <span className={`text-lg font-extrabold ${getScoreColor(rm.matchScore)}`}>
                            {rm.matchScore}%
                          </span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rm.role.demandLevel === 'high' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {rm.role.demandLevel} demand
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary">
                            {rm.role.salaryRange}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rm.explanation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Gap Analysis */}
              <div>
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" /> Gap Analysis
                </h3>
                <div className="space-y-4">
                  {result.gapAnalysis.map((gap, i) => (
                    <Card key={i} className="border-none shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-primary">{gap.skill}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityColor(gap.priority)}`}>
                                {gap.priority}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{gap.recommendation}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Current</div>
                              <div className="text-lg font-bold text-primary">{gap.currentLevel}</div>
                            </div>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Target</div>
                              <div className="text-lg font-bold text-accent">{gap.requiredLevel}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Readiness + Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-md">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Award className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Readiness Level</div>
                      <div className="text-lg font-bold text-primary capitalize">{result.readinessLevel.replace('_', ' ')}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Clock className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estimated Time to Ready</div>
                      <div className="text-lg font-bold text-primary">{result.timeToReady}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <Card className="bg-primary border-none shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">Ready for your personalised roadmap?</h3>
                  <p className="text-primary-foreground/70 mb-6 text-sm">
                    Get a week-by-week plan calibrated to your background, gaps, and target roles.
                  </p>
                  <Button
                    onClick={() => navigate('/roadmap')}
                    className="bg-accent hover:bg-accent/90 text-white px-8 h-12 text-lg gap-2"
                  >
                    <Map className="w-5 h-5" /> Generate My Roadmap
                  </Button>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <p className="text-xs text-center text-muted-foreground">
                This assessment is based on market research patterns from 50+ sources and 150+ PM transitions. Individual outcomes vary.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-2 border-primary text-primary"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-4 h-4" /> Get My Assessment
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
