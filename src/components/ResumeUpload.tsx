import React, { useState, useRef, useCallback } from 'react';
import type { ResumeData } from '@/src/types';
import { extractPdfText, parseResumeText } from '@/src/lib/resume-parser';
import { saveResumeData } from '@/src/lib/storage';

type UploadState = 'idle' | 'reading' | 'parsing' | 'done' | 'error';

interface ResumeUploadProps {
  onParsed?: (data: ResumeData) => void;
  compact?: boolean;
}

export default function ResumeUpload({ onParsed, compact = false }: ResumeUploadProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      setState('error');
      return;
    }

    try {
      setState('reading');
      setError('');
      const text = await extractPdfText(file);

      if (text.trim().length < 50) {
        setError('Could not extract enough text from this PDF. Try a different file.');
        setState('error');
        return;
      }

      setState('parsing');
      const data = await parseResumeText(text);
      data.fileName = file.name;

      setParsedData(data);
      saveResumeData(data);
      setState('done');
      onParsed?.(data);
    } catch (e: any) {
      setError(e.message || 'Failed to parse resume');
      setState('error');
    }
  }, [onParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const statusMessages: Record<UploadState, string> = {
    idle: '',
    reading: 'Reading PDF...',
    parsing: 'AI is analyzing your resume...',
    done: 'Resume parsed successfully!',
    error: error,
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${compact ? 'p-4' : 'p-8'}
          ${dragOver
            ? 'border-teal-500 bg-teal-500/10'
            : state === 'done'
              ? 'border-green-500/50 bg-green-500/5'
              : state === 'error'
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          {state === 'idle' && (
            <>
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm font-medium text-zinc-300">
                Drop your resume PDF here or click to browse
              </p>
              <p className="text-xs text-zinc-500 mt-1">PDF only, first 3 pages analyzed</p>
            </>
          )}
          {(state === 'reading' || state === 'parsing') && (
            <>
              <div className="animate-spin text-2xl mb-2">⏳</div>
              <p className="text-sm text-zinc-400">{statusMessages[state]}</p>
            </>
          )}
          {state === 'done' && parsedData && (
            <>
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-medium text-green-400">{statusMessages[state]}</p>
              <p className="text-xs text-zinc-500 mt-1">{parsedData.fileName}</p>
            </>
          )}
          {state === 'error' && (
            <>
              <div className="text-2xl mb-2">❌</div>
              <p className="text-sm text-red-400">{error}</p>
              <p className="text-xs text-zinc-500 mt-1 cursor-pointer hover:text-zinc-300">Click to try again</p>
            </>
          )}
        </div>
      </div>

      {/* Parsed Resume Preview */}
      {state === 'done' && parsedData && !compact && (
        <div className="space-y-3 bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div>
            <p className="text-sm font-semibold text-zinc-200">{parsedData.name}</p>
            <p className="text-xs text-zinc-400">{parsedData.currentRole} · {parsedData.totalExperience}</p>
          </div>

          {parsedData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parsedData.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {parsedData.pmHighlights.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">PM Highlights</p>
              {parsedData.pmHighlights.map((h, i) => (
                <div key={i} className={`text-xs p-2 rounded-lg border ${
                  h.type === 'strength' ? 'bg-green-500/5 border-green-500/20 text-green-300' :
                  h.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300' :
                  'bg-blue-500/5 border-blue-500/20 text-blue-300'
                }`}>
                  <span className="font-medium">{h.label}</span> — {h.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
