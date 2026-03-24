import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GateTask from '@/src/components/GateTask';
import ResumeUpload from '@/src/components/ResumeUpload';
import { loadProgress } from '@/src/lib/storage';
import type { GateScore, ResumeData } from '@/src/types';

export default function GatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'resume' | 'gate' | 'done'>('resume');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [gateScore, setGateScore] = useState<GateScore | null>(null);

  useEffect(() => {
    const progress = loadProgress();
    if (progress.resumeData) {
      setResumeData(progress.resumeData);
      setStep('gate');
    }
    if (progress.gateScore) {
      setGateScore(progress.gateScore);
      setStep('done');
    }
  }, []);

  const background = loadProgress().oderedProfile?.background || 'other';

  function handleResumeParsed(data: ResumeData) {
    setResumeData(data);
    setStep('gate');
  }

  function handleGateScored(score: GateScore) {
    setGateScore(score);
    setStep('done');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress Indicator */}
      <div className="flex items-center gap-3 mb-8">
        <StepDot active={step === 'resume'} done={step !== 'resume'} label="1. Resume" />
        <div className="flex-1 h-px bg-zinc-800" />
        <StepDot active={step === 'gate'} done={step === 'done'} label="2. Gate Task" />
        <div className="flex-1 h-px bg-zinc-800" />
        <StepDot active={false} done={step === 'done'} label="3. Readiness" />
      </div>

      {/* Step 1: Resume Upload */}
      {step === 'resume' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Upload Your Resume</h1>
            <p className="text-sm text-zinc-400 mt-2">
              We'll analyze your background to personalize your readiness scoring. Your resume is processed by AI — not stored on any server.
            </p>
          </div>
          <ResumeUpload onParsed={handleResumeParsed} />
          <button
            onClick={() => setStep('gate')}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip for now →
          </button>
        </div>
      )}

      {/* Step 2: Gate Task */}
      {step === 'gate' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Your First Action Task</h1>
            <p className="text-sm text-zinc-400 mt-2">
              This isn't a quiz — it's a live sample of how you think about products. The AI will score your response and identify your thinking style.
            </p>
          </div>

          {resumeData && (
            <div className="text-xs text-zinc-500 bg-zinc-900 rounded-lg p-3 border border-zinc-800">
              Resume loaded: <span className="text-zinc-300">{resumeData.name}</span> · {resumeData.currentRole}
            </div>
          )}

          <GateTask background={background} onScored={handleGateScored} />
        </div>
      )}

      {/* Step 3: Done — Navigate to Readiness */}
      {step === 'done' && (
        <div className="space-y-6 text-center">
          <div className="text-4xl">🧭</div>
          <h1 className="text-2xl font-bold text-zinc-100">Ready for Your Readiness Score</h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            We now have your resume and gate task data. Let's calculate your PM readiness across 6 dimensions.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors"
          >
            See My Full Readiness Score →
          </button>
        </div>
      )}
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-3 h-3 rounded-full transition-colors ${
        done ? 'bg-teal-500' : active ? 'bg-teal-500/50 ring-2 ring-teal-500/30' : 'bg-zinc-700'
      }`} />
      <span className={`text-xs ${active || done ? 'text-zinc-300' : 'text-zinc-600'}`}>{label}</span>
    </div>
  );
}
