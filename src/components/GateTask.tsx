import { useState } from 'react';
import type { GateScore, Background } from '@/src/types';
import { scoreGateTask } from '@/src/lib/gate-scorer';
import { saveGateScore } from '@/src/lib/storage';

const MAX_CHARS = 1500;

interface GateTaskProps {
  background: Background | string;
  onScored?: (score: GateScore) => void;
}

export default function GateTask({ background, onScored }: GateTaskProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GateScore | null>(null);
  const [error, setError] = useState('');

  const charsLeft = MAX_CHARS - text.length;
  const canSubmit = text.length >= 20 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError('');

    try {
      const score = await scoreGateTask(text, background);
      setResult(score);
      saveGateScore(score);
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

  return (
    <div className="space-y-6">
      {/* Task Prompt */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Product Teardown</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Pick any app or feature you use regularly. In 1500 characters or less, answer:
        </p>
        <ol className="text-sm text-zinc-300 mt-3 space-y-1 list-decimal list-inside">
          <li>Who is this feature for?</li>
          <li>What problem does it solve?</li>
          <li>How would you know if it's working?</li>
          <li>What would you change — and why?</li>
        </ol>
      </div>

      {/* Text Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Start writing your product teardown..."
          disabled={loading || !!result}
          rows={8}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none disabled:opacity-50"
        />
        <div className={`absolute bottom-3 right-3 text-xs ${charsLeft < 100 ? 'text-amber-400' : 'text-zinc-600'}`}>
          {charsLeft} characters left
        </div>
      </div>

      {/* Submit Button */}
      {!result && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-500 text-white"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Scoring your response...
            </span>
          ) : (
            'Submit for AI Scoring'
          )}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          {/* Score Ring */}
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getScoreColor(result.score)}`}>
              <span className="text-2xl font-bold">{result.score}</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-zinc-100">{result.headline}</p>
              <p className="text-xs text-zinc-500 mt-1 capitalize">Thinking style: {result.thinkingStyle}</p>
            </div>
          </div>

          {/* Strength & Gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-xs font-medium text-green-400 mb-1">Strength</p>
              <p className="text-sm text-zinc-300">{result.strength}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs font-medium text-amber-400 mb-1">Gap</p>
              <p className="text-sm text-zinc-300">{result.gap}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
