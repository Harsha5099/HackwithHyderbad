import React from 'react';
import {
  Brain,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  History,
  Sparkles,
  Layers
} from 'lucide-react';
import { ClientMemory } from '../../types';

interface MemoryTabProps {
  clientMemory: ClientMemory | null;
  memoryLoading: boolean;
  onRefreshMemory: () => void;
  bankName: string;
}

export const MemoryTab: React.FC<MemoryTabProps> = ({
  clientMemory,
  memoryLoading,
  onRefreshMemory,
  bankName
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Live Bank Inspector
            </span>
            <h3 className="text-base font-bold text-slate-900">
              🧠 Hindsight Client Memory Bank ({bankName})
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Visualizing durable facts, preferences, objections, and recent learnings accumulated over time.
          </p>
        </div>

        <button
          onClick={onRefreshMemory}
          disabled={memoryLoading}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${memoryLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Bank</span>
        </button>
      </div>

      {memoryLoading || !clientMemory ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Fetching facts from Hindsight bank...</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Structured Memory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Likes / Priorities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>LIKES / PRIORITIES</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {clientMemory.likesAndPriorities.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concerns */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-amber-700">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>CONCERNS</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {clientMemory.concerns.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">⚠</span>
                    <span className={item.includes('90-day') ? 'font-bold text-rose-700' : ''}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dislikes / Objections */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>DISLIKES</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {clientMemory.dislikesAndObjections.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Important History & Recent Learnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-indigo-700">
                <History className="w-4 h-4 text-indigo-600" />
                <span>IMPORTANT HISTORY</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {clientMemory.importantHistory.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Learning Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6 shadow-sm">
              <h4 className="font-bold text-indigo-950 text-sm mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>RECENT ADAPTIVE LEARNING</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-indigo-900">
                {clientMemory.recentLearning.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                    <span className="text-indigo-600 font-bold">💡</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Raw Memory Units Inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Raw Memory Units in Bank ({clientMemory.rawMemories.length})</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Last updated: {new Date(clientMemory.lastUpdated).toLocaleTimeString()}
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {clientMemory.rawMemories.map((unit, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>Unit ID: {unit.id || `node-${idx}`}</span>
                    <span>Type: {unit.type || 'memory_unit'}</span>
                  </div>
                  <p className="line-clamp-2">{unit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
