import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/Card';
import { RoadmapWeek, RoadmapTask, TaskType } from '@/src/types';
import { generateRoadmap } from '@/src/lib/roadmap-engine';
import { saveTaskCompletionToSupabase } from '@/src/lib/supabase-storage';
import { useAuth } from '@/src/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { useXP } from '@/src/hooks/useXP';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Hammer,
  Code,
  Users,
  Target,
  Trophy,
  Calendar,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const TASK_TYPE_CONFIG: Record<TaskType, { label: string; color: string; icon: any }> = {
  learn: { label: 'Learn', color: 'bg-blue-100 text-blue-700', icon: BookOpen },
  do: { label: 'Do', color: 'bg-green-100 text-green-700', icon: Target },
  build: { label: 'Build', color: 'bg-purple-100 text-purple-700', icon: Code },
  network: { label: 'Network', color: 'bg-amber-100 text-amber-700', icon: Users },
  practice: { label: 'Practice', color: 'bg-red-100 text-red-700', icon: Hammer },
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();
  const { award } = useXP();
  const { progress: authProgress, refreshProgress } = useAuth();

  useEffect(() => {
    if (authProgress.oderedProfile && authProgress.assessmentResult) {
      const weeks = generateRoadmap(authProgress.oderedProfile, authProgress.assessmentResult);
      setRoadmap(weeks);
      setCompletedTasks(new Set(authProgress.completedTaskIds));
      setHasData(true);

      // Auto-expand current week
      const currentWeek = authProgress.currentWeek || 1;
      setExpandedWeek(currentWeek);
    }
  }, [authProgress]);

  const totalTasks = useMemo(() => roadmap.reduce((sum, w) => sum + w.tasks.length, 0), [roadmap]);
  const completedCount = completedTasks.size;
  const overallProgress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const currentWeekData = useMemo(() => {
    const weekNum = authProgress.currentWeek || 1;
    return roadmap.find(w => w.weekNumber === weekNum);
  }, [roadmap, authProgress]);

  const handleToggleTask = (taskId: string, weekNumber: number, taskTitle?: string) => {
    const willBeCompleted = !completedTasks.has(taskId);
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (willBeCompleted) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
    saveTaskCompletionToSupabase(weekNumber, taskId, willBeCompleted);
    if (willBeCompleted) {
      award('roadmap-task', 5, taskTitle || 'Roadmap task');
    }
    refreshProgress();
  };

  const getWeekProgress = (week: RoadmapWeek) => {
    const done = week.tasks.filter(t => completedTasks.has(t.id)).length;
    return { done, total: week.tasks.length, pct: week.tasks.length > 0 ? Math.round((done / week.tasks.length) * 100) : 0 };
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
            <AlertCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-extrabold text-primary">No Roadmap Yet</h1>
          <p className="text-muted-foreground">
            Complete the assessment first to generate your personalised 12-week roadmap.
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Your Personalised PM Roadmap</h1>
          <p className="text-muted-foreground mt-2">
            {authProgress.oderedProfile?.background?.replace(/^\w/, c => c.toUpperCase())} → PM • {roadmap.length} weeks
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-primary">Overall Progress</span>
              <span className="text-sm font-bold text-accent">{overallProgress}% • {completedCount}/{totalTasks} tasks</span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* This Week's Focus */}
        {currentWeekData && (
          <Card className="border-accent/30 bg-accent/5 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" /> This Week's Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentWeekData.tasks.slice(0, 3).map(task => {
                  const done = completedTasks.has(task.id);
                  const TypeConfig = TASK_TYPE_CONFIG[task.type];
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        done ? 'bg-accent/10 border-accent/20' : 'bg-card border-border hover:border-accent'
                      }`}
                      onClick={() => handleToggleTask(task.id, currentWeekData.weekNumber, task.title)}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-muted-foreground' : 'text-primary'}`}>
                        {task.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TypeConfig.color}`}>
                        {TypeConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Week-by-week Timeline */}
        <div className="space-y-4">
          {roadmap.map((week) => {
            const isExpanded = expandedWeek === week.weekNumber;
            const { done, total, pct } = getWeekProgress(week);
            const isComplete = pct === 100;
            const isCurrent = week.weekNumber === (authProgress.currentWeek || 1);

            return (
              <motion.div
                key={week.weekNumber}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: week.weekNumber * 0.03 }}
              >
                <Card
                  className={`border-none shadow-sm transition-all ${
                    isCurrent
                      ? 'ring-2 ring-accent/30 shadow-md'
                      : isComplete
                        ? 'opacity-80'
                        : ''
                  }`}
                >
                  {/* Week Header - Clickable */}
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          isComplete
                            ? 'bg-accent text-white'
                            : isCurrent
                              ? 'bg-accent/20 text-accent border-2 border-accent'
                              : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : week.weekNumber}
                      </div>
                      <div>
                        <div className="font-bold text-primary">
                          Week {week.weekNumber}: {week.theme}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {week.estimatedHours}h
                          </span>
                          <span>{done}/{total} tasks</span>
                          {week.milestone && (
                            <span className="flex items-center gap-1 text-accent">
                              <Trophy className="w-3 h-3" /> {week.milestone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Tasks */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                          {week.tasks.map(task => {
                            const done = completedTasks.has(task.id);
                            const TypeConfig = TASK_TYPE_CONFIG[task.type];
                            const Icon = TypeConfig.icon;

                            return (
                              <div
                                key={task.id}
                                className={`p-4 rounded-xl border transition-all ${
                                  done ? 'bg-accent/5 border-accent/20' : 'bg-card border-border'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => handleToggleTask(task.id, week.weekNumber, task.title)}
                                    className="mt-0.5 shrink-0"
                                  >
                                    {done ? (
                                      <CheckCircle2 className="w-5 h-5 text-accent" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
                                    )}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`font-bold text-sm ${done ? 'line-through text-muted-foreground' : 'text-primary'}`}>
                                        {task.title}
                                      </span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${TypeConfig.color}`}>
                                        <Icon className="w-3 h-3" /> {TypeConfig.label}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                      {task.description}
                                    </p>
                                    {task.deliverable && (
                                      <div className="mt-2 text-xs text-accent font-medium flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3" /> Deliverable: {task.deliverable}
                                      </div>
                                    )}
                                    {task.resource && (
                                      <a
                                        href={task.resource}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 text-xs text-blue-500 hover:underline inline-block"
                                      >
                                        Resource link
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
