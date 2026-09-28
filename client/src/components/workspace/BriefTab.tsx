import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Brain,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from 'lucide-react';
import { MeetingBriefResponse } from '../../types';

interface BriefTabProps {
  briefResponse: MeetingBriefResponse | null;
  briefLoading: boolean;
  onGenerateBrief: () => void;
  onHelpfulFeedback: () => void;
  onOpenFeedbackModal: () => void;
  feedbackSubmitted: boolean | null;
  submittingFeedback: boolean;
  bankName: string;
}

export const BriefTab: React.FC<BriefTabProps> = ({
  briefResponse,
  briefLoading,
  onGenerateBrief,
  onHelpfulFeedback,
  onOpenFeedbackModal,
  feedbackSubmitted,
  submittingFeedback,
  bankName
}) => {
  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Hindsight Reflect Engine
            </span>
            <h3 className="text-base font-bold text-slate-900">Executive Client Meeting Brief</h3>
          </div>
          <p className="text-xs text-slate-500">
            Personalized strategy synthesized from long-term memory, past objections, and verified commitments.
          </p>
        </div>

        <button
          onClick={onGenerateBrief}
          disabled={briefLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${briefLoading ? 'animate-spin' : ''}`} />
          <span>{briefLoading ? 'Synthesizing...' : 'Regenerate Brief'}</span>
        </button>
      </div>

      {briefLoading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Brain className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">Reflecting on Client Memory...</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Analyzing historical objections, what worked, and recent learnings from bank {bankName}.
          </p>
        </div>
      ) : briefResponse ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Recommended Approach Hero */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-800/40 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Recommended Strategic Approach</span>
            </div>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal mb-4">
              {briefResponse.brief.recommendedStrategy}
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-200">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Based on {briefResponse.memoriesUsed.length} memories retained in Hindsight</span>
              </div>
              <span>Generated: {new Date(briefResponse.generatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Grid: Priorities, Objections, What Worked, What to Avoid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Priorities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-indigo-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Client Key Priorities</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {briefResponse.brief.keyPriorities.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                    <span className={item.includes('90-DAY') ? 'font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded' : ''}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Previous Objections */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Previous Objections & Hurdles</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {briefResponse.brief.previousObjections.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What Worked */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-emerald-700">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>What Worked in Past Interactions</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {briefResponse.brief.whatWorked.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Avoid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-amber-700">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>What to Strictly Avoid</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {briefResponse.brief.whatToAvoid.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center space-x-2 text-indigo-700">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>High-Impact Questions to Ask in Meeting</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {briefResponse.brief.suggestedQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 font-medium">
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Memory Sources Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Memory Sources (Retrieved from Hindsight)</span>
            </h4>
            <div className="space-y-2">
              {briefResponse.memoriesUsed.map((mem, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-3"
                >
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-indigo-100 text-indigo-800 flex-shrink-0">
                    Mem #{idx + 1}
                  </span>
                  <p className="flex-1">{mem.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEEDBACK LEARNING SECTION */}
          <div className="bg-indigo-50/80 rounded-2xl border border-indigo-200 p-6 text-center space-y-3">
            <h4 className="font-bold text-indigo-950 text-sm">
              Was this meeting brief helpful?
            </h4>
            <p className="text-xs text-indigo-800 max-w-md mx-auto">
              Provide feedback to train the agent. Corrective feedback is retained in Hindsight so the AI adapts its future advice!
            </p>

            {feedbackSubmitted === null ? (
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={onHelpfulFeedback}
                  disabled={submittingFeedback}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold text-xs shadow-2xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful</span>
                </button>

                <button
                  onClick={onOpenFeedbackModal}
                  disabled={submittingFeedback}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-xs shadow-2xs"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not Helpful (Teach Agent)</span>
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-white px-4 py-2 rounded-full border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Feedback retained in Hindsight memory for next meeting brief!</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">Click "Prepare Me for Meeting" to generate.</p>
        </div>
      )}
    </div>
  );
};
