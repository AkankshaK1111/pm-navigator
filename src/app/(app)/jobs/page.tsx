import { useState, useEffect } from 'react';
import { loadProgress } from '@/src/lib/storage';
import { calculateJobListingFit } from '@/src/lib/job-listings';
import { getAIJobMatches, isJobMatcherConfigured } from '@/src/lib/job-matcher';
import { getPersonalizedTrends, isTrendsConfigured } from '@/src/lib/job-trends';
import type { JobListingWithFit, JobMatch, TrendSignal } from '@/src/types';

export default function JobsPage() {
  const [listings, setListings] = useState<JobListingWithFit[]>([]);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [trends, setTrends] = useState<TrendSignal[]>([]);
  const [loading, setLoading] = useState({ matches: false, trends: false });
  const [tab, setTab] = useState<'matches' | 'listings' | 'trends'>('matches');

  useEffect(() => {
    const progress = loadProgress();

    // Math-based listings (instant)
    const jobsWithFit = calculateJobListingFit(progress.aiReadinessScores);
    setListings(jobsWithFit);

    // AI-powered matches
    const bg = progress.oderedProfile?.background || 'other';
    const target = progress.targetCompany || '';

    if (isJobMatcherConfigured()) {
      setLoading(prev => ({ ...prev, matches: true }));
      getAIJobMatches(bg, target, progress.resumeData, progress.aiReadinessScores, progress.gateScore)
        .then(setMatches)
        .catch(() => {})
        .finally(() => setLoading(prev => ({ ...prev, matches: false })));
    }

    if (isTrendsConfigured()) {
      setLoading(prev => ({ ...prev, trends: true }));
      getPersonalizedTrends(bg, target, progress.aiReadinessScores)
        .then(setTrends)
        .catch(() => {})
        .finally(() => setLoading(prev => ({ ...prev, trends: false })));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-2">Job Intelligence</h1>
      <p className="text-sm text-zinc-400 mb-8">Personalized matches based on your readiness scores and curated market data.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
        {(['matches', 'listings', 'trends'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t === 'matches' ? 'AI Matches' : t === 'listings' ? `All Listings (${listings.length})` : 'Trends'}
          </button>
        ))}
      </div>

      {/* AI Matches */}
      {tab === 'matches' && (
        <div className="space-y-3">
          {loading.matches ? (
            <LoadingCard text="Finding your best matches..." />
          ) : matches.length === 0 ? (
            <EmptyCard text="Complete your assessment and gate task to get AI-powered job matches." />
          ) : (
            matches.map((job, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{job.title}</h3>
                    <p className="text-xs text-zinc-400">{job.company} · {job.stage} · {job.city}</p>
                  </div>
                  <div className={`text-lg font-bold ${
                    job.fit >= 75 ? 'text-green-400' : job.fit >= 55 ? 'text-blue-400' : job.fit >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {job.fit}%
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{job.gapNote}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{job.salary}</span>
                  <span>·</span>
                  <span>{job.interviewRounds} rounds</span>
                  {job.isTarget && <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">Target</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* All Listings */}
      {tab === 'listings' && (
        <div className="space-y-3">
          {listings.map(job => (
            <div key={job.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">{job.title}</h3>
                  <p className="text-xs text-zinc-400">{job.company} · {job.city}</p>
                </div>
                <div className={`text-base font-bold ${
                  job.fitPercent >= 75 ? 'text-green-400' : job.fitPercent >= 55 ? 'text-blue-400' : job.fitPercent >= 40 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {job.fitPercent}%
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-3">{job.description}</p>
              {/* Dimension bars */}
              <div className="flex gap-2 flex-wrap">
                {job.dimComparisons.map((dc, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${
                    dc.met ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    {dc.dim}: {dc.user}/{dc.required}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                <span>{job.salary}</span>
                <span>·</span>
                <span>{job.interviewRounds} rounds</span>
                {job.switcherFriendly && <span className="text-green-500">Switcher-friendly</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trends */}
      {tab === 'trends' && (
        <div className="space-y-3">
          {loading.trends ? (
            <LoadingCard text="Analyzing market trends..." />
          ) : trends.length === 0 ? (
            <EmptyCard text="Complete your assessment to get personalized trend signals." />
          ) : (
            trends.map((signal, i) => {
              const colors = {
                positive: 'border-green-500/20 bg-green-500/5',
                warning: 'border-amber-500/20 bg-amber-500/5',
                neutral: 'border-zinc-700 bg-zinc-900',
                negative: 'border-red-500/20 bg-red-500/5',
              };
              const dotColors = {
                positive: 'bg-green-400',
                warning: 'bg-amber-400',
                neutral: 'bg-zinc-500',
                negative: 'bg-red-400',
              };
              const impact = signal.impact as keyof typeof colors;
              return (
                <div key={i} className={`border rounded-xl p-4 ${colors[impact] || colors.neutral}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[impact] || dotColors.neutral}`} />
                    <p className="text-sm text-zinc-300">{signal.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function LoadingCard({ text }: { text: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
      <div className="animate-spin text-xl mb-2">⏳</div>
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
      <p className="text-sm text-zinc-500">{text}</p>
    </div>
  );
}
