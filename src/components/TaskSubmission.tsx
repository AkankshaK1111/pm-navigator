import { useState } from 'react';
import type { DailyTaskScore, TaskScoringType } from '@/src/types';
import { scoreDailyTask } from '@/src/lib/task-scorer';
import { saveDailyTaskResult } from '@/src/lib/storage';
import { useXP } from '@/src/hooks/useXP';

interface TaskSubmissionProps {
  taskId: string;
  taskType: TaskScoringType;
  taskPrompt: string;
  dimension: string;
  background: string;
  targetCompany: string;
  currentDimScore: number;
  onScored?: (result: DailyTaskScore) => void;
}

export default function TaskSubmission({
  taskId,
  taskType,
  taskPrompt,
  dimension,
  background,
  targetCompany,
  currentDimScore,
  onScored,
}: TaskSubmissionProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DailyTaskScore | null>(null);
  const [error, setError] = useState('');
  const { award } = useXP();

  const canSubmit = text.length >= 20 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const score = await scoreDailyTask(
        text, taskType, taskPrompt, dimension, background, targetCompany, currentDimScore
      );
      setResult(score);
      saveDailyTaskResult({
        id: taskId,
        taskType,
        taskPrompt,
        dimension,
        answerText: text,
        result: score,
        createdAt: new Date().toISOString(),
      });
      award('daily-task', 10 + Math.floor(score.score / 10), taskPrompt);
      onScored?.(score);
    } catch (e: any) {
      setError(e.message || 'Failed to score your response');
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-400 border-green-500';
    if (score >= 60) return 'text-blue-400 border-blue-500';
    if (score >= 40) return 'text-amber-400 border-amber-500';
    return 'text-red-400 border-red-500';
  }

  const typeLabels: Record<TaskScoringType, string> = {
    'product-teardown': 'Product Teardown',
    'metric-diagnosis': 'Metric Diagnosis',
    'business-case': 'Business Case',
    'technical-tradeoff': 'Technical Tradeoff',
    'ai-feature-design': 'AI Feature Design',
    'stakeholder-conflict': 'Stakeholder Conflict',
  };

  return (
    <div className="space-y-4">
      {/* Task Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {typeLabels[taskType]}
          </span>
          <span className="text-xs text-zinc-500">→ {dimension}</span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{taskPrompt}</p>
      </div>

      {/* Text Input */}
      {!result && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your response..."
            disabled={loading}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-500 text-white"
          >
            {loading ? 'Scoring...' : 'Submit for AI Scoring'}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Result */}
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center ${getScoreColor(result.score)}`}>
              <span className="text-xl font-bold">{result.score}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-100">{result.headline}</p>
              {result.dimensionImpact && (
                <p className="text-xs text-teal-400 mt-1">
                  {result.dimensionImpact.name}: +{result.dimensionImpact.delta} points → {result.dimensionImpact.newEstimate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-xs font-medium text-green-400 mb-1">Strength</p>
              <p className="text-xs text-zinc-300">{result.strength}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs font-medium text-amber-400 mb-1">Gap</p>
              <p className="text-xs text-zinc-300">{result.gap}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
