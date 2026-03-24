import { useState, useRef, useEffect } from 'react';
import { askNorth, isNorthConfigured } from '@/src/lib/north-chat';
import { loadProgress, saveNorthChatHistory } from '@/src/lib/storage';
import RejectionFlow from '@/src/components/RejectionFlow';
import type { NorthMessage, NorthContext } from '@/src/types';

const QUICK_CHIPS = [
  "I'm feeling stuck",
  "How am I doing?",
  "What to do today?",
  "I got rejected",
  "Mock Interview",
];

export default function NorthChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NorthMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = loadProgress();
    if (progress.northChatHistory?.length) {
      setMessages(progress.northChatHistory);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isNorthConfigured()) return null;

  function getContext(): NorthContext {
    const p = loadProgress();
    return {
      name: p.resumeData?.name || p.oderedProfile?.name || 'User',
      background: p.oderedProfile?.background || 'Not specified',
      targetCompany: p.targetCompany || '',
      currentRole: p.resumeData?.currentRole || p.oderedProfile?.currentRole || '',
      totalExperience: p.resumeData?.totalExperience || '',
      readinessOverall: p.aiReadinessScores?.overall ?? null,
      gateScore: p.gateScore,
      resumeHighlights: p.resumeData?.pmHighlights || [],
      aiDimensions: p.aiReadinessScores?.dimensions || [],
    };
  }

  async function send(text: string) {
    if (!text.trim() || typing) return;

    const userMsg: NorthMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setTyping(true);

    try {
      const { reply } = await askNorth(text, getContext());
      const northMsg: NorthMessage = {
        id: (Date.now() + 1).toString(),
        role: 'north',
        text: reply,
        timestamp: new Date().toISOString(),
      };
      const withReply = [...updated, northMsg];
      setMessages(withReply);
      saveNorthChatHistory(withReply);
    } catch {
      const errMsg: NorthMessage = {
        id: (Date.now() + 1).toString(),
        role: 'north',
        text: "Sorry, I couldn't process that. Try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20 flex items-center justify-center transition-all hover:scale-105"
          title="Talk to North"
        >
          <span className="text-2xl">🧭</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[520px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧭</span>
              <div>
                <p className="text-sm font-semibold text-zinc-100">North</p>
                <p className="text-xs text-zinc-500">Your PM career guide</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-lg">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[320px]">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-zinc-400">Hey! I'm North. Ask me anything about your PM journey.</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-teal-600/20 text-teal-100 border border-teal-500/20'
                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-400">
                  ···
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          {messages.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => chip === 'I got rejected' ? setShowRejection(true) : send(chip)}
                  className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-teal-500/50 hover:text-teal-300 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(input)}
                placeholder="Ask North anything..."
                disabled={typing}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 disabled:opacity-50"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm disabled:opacity-40 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Flow Modal */}
      {showRejection && (
        <RejectionFlow
          initialMessage="I got rejected"
          onClose={() => setShowRejection(false)}
        />
      )}
    </>
  );
}
