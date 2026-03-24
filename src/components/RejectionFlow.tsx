import { useState } from 'react';
import { runRejectionAgent, isRejectionAgentConfigured } from '@/src/lib/rejection-agent';
import { loadProgress } from '@/src/lib/storage';
import type { RejectionDiagnosis } from '@/src/types';

interface RejectionFlowProps {
  initialMessage?: string;
  onClose: () => void;
}

export default function RejectionFlow({ initialMessage, onClose }: RejectionFlowProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'clarify' | 'result'>('input');
  const [message, setMessage] = useState(initialMessage || '');
  const [clarifyQuestion, setClarifyQuestion] = useState('');
  const [diagnosis, setDiagnosis] = useState<RejectionDiagnosis | null>(null);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (!isRejectionAgentConfigured()) return null;

  async function submit(text: string) {
    if (!text.trim()) return;
    setStep('loading');
    setError('');

    const progress = loadProgress();
    try {
      const result = await runRejectionAgent(
        text,
        progress.oderedProfile?.background || '',
        progress.targetCompany || '',
        progress.resumeData || null,
        progress.gateScore || null,
        progress.aiReadinessScores || null
      );

      if (result.needsInfo && result.question) {
        setClarifyQuestion(result.question);
        setStep('clarify');
      } else if (result.diagnosis) {
        setDiagnosis(result.diagnosis);
        setStep('result');
      }
    } catch {
      setError('Something went wrong. Try again in a moment.');
      setStep('input');
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Post-Rejection Agent</h2>
            <p className="text-xs text-zinc-500">Diagnose what went wrong + 2-week recovery plan</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
        </div>

        <div className="p-5">
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Tell me what happened — which company, which round, and any details you remember.</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. I got rejected from Razorpay after the product case study round..."
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                onClick={() => submit(message)}
                disabled={!message.trim()}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-40 transition-colors"
              >
                Diagnose
              </button>
            </div>
          )}

          {/* Loading */}
          {step === 'loading' && (
            <div className="text-center py-12">
              <div className="animate-spin text-2xl mb-3">🔍</div>
              <p className="text-sm text-zinc-400">Analyzing your rejection...</p>
              <p className="text-xs text-zinc-600 mt-1">Comparing your scores against hiring bar</p>
            </div>
          )}

          {/* Clarify Step */}
          {step === 'clarify' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-300">{clarifyQuestion}</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 resize-none"
              />
              <button
                onClick={() => submit(message)}
                disabled={!message.trim()}
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-40 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Result */}
          {step === 'result' && diagnosis && (
            <div className="space-y-5">
              {/* Headline */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm font-medium text-red-300">{diagnosis.headline}</p>
                <p className="text-xs text-zinc-500 mt-1">{diagnosis.company} · {diagnosis.round}</p>
              </div>

              {/* Root Causes */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Root Causes</h3>
                {[diagnosis.rootCause.primary, diagnosis.rootCause.secondary].map((cause, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-200">{cause.dimension}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-red-400">You: {cause.userScore}</span>
                        <span className="text-zinc-600">vs</span>
                        <span className="text-green-400">Bar: {cause.companyBar}</span>
                        <span className={`font-bold ${cause.gap > 15 ? 'text-red-400' : 'text-amber-400'}`}>
                          -{cause.gap}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">{cause.explanation}</p>
                    {/* Gap bar */}
                    <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500/60 rounded-full"
                        style={{ width: `${Math.min(cause.userScore, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recovery Plan */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Recovery Plan · {diagnosis.recoveryPlan.duration}
                </h3>
                <div className="flex gap-1.5 mb-2">
                  {diagnosis.recoveryPlan.focusAreas.map(area => (
                    <span key={area} className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {area}
                    </span>
                  ))}
                </div>

                {diagnosis.recoveryPlan.weeks.map(week => (
                  <div key={week.week} className="border border-zinc-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
                    >
                      <span className="text-sm font-medium text-zinc-200">Week {week.week}: {week.theme}</span>
                      <span className="text-zinc-500 text-xs">{expandedWeek === week.week ? '▾' : '▸'}</span>
                    </button>
                    {expandedWeek === week.week && (
                      <div className="divide-y divide-zinc-800/50">
                        {week.days.map(day => (
                          <div key={day.day} className="px-4 py-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-teal-400">Day {day.day}</span>
                              <span className="text-xs text-zinc-600">{day.time}</span>
                            </div>
                            <p className="text-sm text-zinc-300">{day.task}</p>
                            <p className="text-xs text-zinc-500 mt-1">Output: {day.output}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reapply Signal */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                <p className="text-xs font-semibold text-zinc-400 mb-1">When to reapply</p>
                <p className="text-sm text-zinc-300">{diagnosis.reapplySignal}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
