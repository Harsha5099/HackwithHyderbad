import React, { useRef, useEffect } from 'react';
import { Brain, Lightbulb, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage, MemoryCitation } from '../../types';

interface ChatTabProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  chatLoading: boolean;
  onSendMessage: (text?: string) => void;
  onClearChat: () => void;
  lastMemoriesUsed: MemoryCitation[];
  expandedMemories: Record<number, boolean>;
  setExpandedMemories: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  companyName: string;
  bankName: string;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  chatLoading,
  onSendMessage,
  onClearChat,
  lastMemoriesUsed,
  expandedMemories,
  setExpandedMemories,
  companyName,
  bankName
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const suggestedQuestions = [
    'Why did Acme reject our previous proposal?',
    'What approach worked best with Acme?',
    'What are their biggest concerns?',
    'What should I avoid discussing?',
    'Summarize our relationship with this client.'
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <span>ClientPulse AI Assistant</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Grounded in Memory
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Retrieves verified historical facts from Hindsight bank <code>{bankName}</code>
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 bg-white"
        >
          Clear
        </button>
      </div>

      {/* Suggested Prompts Banner */}
      <div className="bg-indigo-50/70 border-b border-indigo-100 p-3 sm:px-6">
        <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center space-x-1">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
          <span>Suggested Questions:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map(prompt => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100/80 text-xs font-medium text-indigo-900 border border-indigo-200 shadow-2xs transition-colors text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Brain className="w-12 h-12 text-indigo-300 mb-3 animate-pulse" />
            <h4 className="font-bold text-slate-700 text-base mb-1">
              Ask Anything About {companyName}
            </h4>
            <p className="text-xs max-w-md text-slate-500">
              The AI retrieves facts directly from Hindsight memory. Click any suggested prompt above or ask about objections, preferences, and commitments.
            </p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Expandable Memory Cited Box */}
                {!isUser && lastMemoriesUsed.length > 0 && idx === chatMessages.length - 1 && (
                  <div className="max-w-[85%] bg-indigo-50/60 rounded-xl border border-indigo-200 p-3 text-xs">
                    <button
                      onClick={() =>
                        setExpandedMemories(prev => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="w-full flex items-center justify-between text-indigo-900 font-semibold text-[11px]"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                        <span>🧠 Memory Consulted ({lastMemoriesUsed.length} Hindsight facts)</span>
                      </span>
                      {expandedMemories[idx] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedMemories[idx] && (
                      <div className="mt-2.5 pt-2 border-t border-indigo-200/70 space-y-2">
                        {lastMemoriesUsed.map((mem, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded-lg bg-white border border-indigo-100 text-[11px] text-slate-700"
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                              <span>Fact #{mIdx + 1} ({mem.type || 'Hindsight Fact'})</span>
                              {mem.score && <span>Reranker: {mem.score.toFixed(2)}</span>}
                            </div>
                            <p>{mem.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {chatLoading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 bg-indigo-50 p-3 rounded-xl max-w-xs animate-pulse">
            <Brain className="w-4 h-4 animate-spin" />
            <span>Consulting Hindsight bank & reasoning...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder={`Ask about ${companyName}'s past interactions, objections, or preferences...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
