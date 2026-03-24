import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { ReadinessScore, RoadmapWeek, AssessmentResult } from '@/src/types';
import { calculateReadiness } from '@/src/lib/readiness-scorer';
import { generateRoadmap } from '@/src/lib/roadmap-engine';
import { saveTaskCompletionToSupabase } from '@/src/lib/supabase-storage';
import { useAuth } from '@/src/lib/auth-context';
import { useNavigate, Link } from 'react-router-dom';
import {
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  MessageSquare,
  Map,
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
} from 'lucide-react';

export default function DashboardPage() {
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [hasData, setHasData] = useState(false);
  const [daysInPrep, setDaysInPrep] = useState(0);
  const navigate = useNavigate();
  const { progress: authProgress, refreshProgress } = useAuth();

  useEffect(() => {
    if (authProgress.oderedProfile && authProgress.assessmentResult) {
      const weeks = generateRoadmap(authProgress.oderedProfile, authProgress.assessmentResult);
      const totalTasks = weeks.reduce((sum, w) => sum + w.tasks.length, 0);
      const score = calculateReadiness(
        authProgress.oderedProfile,
        authProgress.completedTaskIds,
        authProgress.currentWeek,
        totalTasks
      );

      setRoadmap(weeks);
      setAssessment(authProgress.assessmentResult);
      setReadiness(score);
      setCompletedTasks(new Set(authProgress.completedTaskIds));
      setHasData(true);

      // Calculate days in prep
      const started = new Date(authProgress.startedAt);
      const now = new Date();
      setDaysInPrep(Math.max(1, Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24))));
    }
  }, [authProgress]);

  const totalTasks = useMemo(() => roadmap.reduce((sum, w) => sum + w.tasks.length, 0), [roadmap]);
  const currentWeekNum = authProgress.currentWeek || 1;
  const currentWeekData = roadmap.find(w => w.weekNumber === currentWeekNum);

  const handleToggleTask = (taskId: string) => {
    const willBeCompleted = !completedTasks.has(taskId);
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (willBeCompleted) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
    saveTaskCompletionToSupabase(currentWeekNum, taskId, willBeCompleted);
    refreshProgress();
    // Recalculate readiness
    if (authProgress.oderedProfile) {
      const updatedIds = willBeCompleted
        ? [...authProgress.completedTaskIds, taskId]
        : authProgress.completedTaskIds.filter(id => id !== taskId);
      const score = calculateReadiness(authProgress.oderedProfile, updatedIds, currentWeekNum, totalTasks);
      setReadiness(score);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-blue-500';
    if (score >= 35) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreStrokeClass = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 55) return 'text-blue-500';
    if (score >= 35) return 'text-amber-500';
    return 'text-red-500';
  };

  if (!hasData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold text-primary">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Complete the PM fit assessment to unlock your personalised dashboard with readiness scoring, progress tracking, and gap analysis.
          </p>
          <Button
            onClick={() => navigate('/assessment')}
            className="bg-accent hover:bg-accent/90 text-white px-8 h-12 gap-2"
          >
            <Target className="w-5 h-5" /> Take Assessment
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your PM readiness command center</p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Readiness Score */}
          <Card className="border-none shadow-md">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-secondary" />
                  <circle
                    cx="40" cy="40" r="34"
                    stroke="currentColor" strokeWidth="6" fill="transparent"
                    strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * (readiness?.overallScore || 0)) / 100}
                    strokeLinecap="round"
                    className={`${getScoreStrokeClass(readiness?.overallScore || 0)} transition-all duration-1000`}
                  />
                </svg>
                <span className={`absolute text-xl font-extrabold ${getScoreColor(readiness?.overallScore || 0)}`}>
                  {readiness?.overallScore || 0}
                </span>
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Readiness</div>
              <div className="text-xs text-accent font-bold capitalize mt-1">
                {readiness?.level?.replace(/_/g, ' ')}
              </div>
            </CardContent>
          </Card>

          {/* Days in Prep */}
          <Card className="border-none shadow-md">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-accent/10 mb-2">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-extrabold text-primary">{daysInPrep}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Days in Prep</div>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card className="border-none shadow-md">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-accent/10 mb-2">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-extrabold text-primary">
                {completedTasks.size}<span className="text-sm text-muted-foreground font-normal">/{totalTasks}</span>
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tasks Done</div>
            </CardContent>
          </Card>

          {/* Current Week */}
          <Card className="border-none shadow-md">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-accent/10 mb-2">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-extrabold text-primary">Week {currentWeekNum}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {currentWeekData?.theme || 'Current'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* This Week's Focus */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" /> This Week's Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentWeekData ? (
                currentWeekData.tasks.slice(0, 4).map(task => {
                  const done = completedTasks.has(task.id);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        done ? 'bg-accent/5 border-accent/20' : 'bg-card border-border hover:border-accent'
                      }`}
                      onClick={() => handleToggleTask(task.id)}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : 'text-primary'}`}>
                        {task.title}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No tasks for this week</p>
              )}
            </CardContent>
          </Card>

          {/* Skills Dimensions */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" /> Readiness Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {readiness &&
                Object.entries(readiness.dimensions).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    productThinking: 'Product Thinking',
                    technicalFluency: 'Technical Fluency',
                    communicationSkill: 'Communication',
                    portfolioStrength: 'Portfolio',
                    networkStrength: 'Networking',
                    aiFluency: 'AI Fluency',
                    interviewPrep: 'Interview Prep',
                  };
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-primary">{labels[key] || key}</span>
                        <span className="font-bold text-accent">{value}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* Gap Analysis */}
        {assessment && assessment.gapAnalysis.length > 0 && (
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Top Gaps to Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assessment.gapAnalysis.slice(0, 3).map((gap, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-primary">{gap.skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        gap.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Lv {gap.currentLevel}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-accent font-bold">Lv {gap.requiredLevel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{gap.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Honest Assessment */}
        {readiness && (
          <Card className="bg-accent/5 border-accent/20 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-primary text-sm mb-1">Honest Assessment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{readiness.honestAssessment}</p>
                  {readiness.nextMilestone && (
                    <p className="text-sm text-accent font-medium mt-2 flex items-center gap-1">
                      <ArrowRight className="w-4 h-4" /> Next: {readiness.nextMilestone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/mock-interview">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent transition-colors">
                  <MessageSquare className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary">Mock Interview</div>
                  <div className="text-xs text-muted-foreground">Practice PM questions</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/roadmap">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent transition-colors">
                  <Map className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary">View Roadmap</div>
                  <div className="text-xs text-muted-foreground">See your full plan</div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/assessment">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent transition-colors">
                  <Target className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="font-bold text-sm text-primary">Retake Assessment</div>
                  <div className="text-xs text-muted-foreground">Update your profile</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
