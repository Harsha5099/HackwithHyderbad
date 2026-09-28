import React, { useState } from 'react';
import { X, ThumbsDown, Brain } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
  submitting: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting
}) => {
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    await onSubmit(feedbackText);
    setFeedbackText('');
  };

  const handleUseExample = () => {
    setFeedbackText(
      'The recommendation focused too much on pricing. The client was actually more concerned about implementation time.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-rose-50 p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ThumbsDown className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-rose-950 text-base">Teach the Agent</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            What was wrong with the recommendation? This feedback will be retained in Hindsight so future briefings adapt.
          </p>

          <div>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 mb-2 block"
            >
              + Use Demo Example Correction
            </button>
            <textarea
              rows={3}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="e.g. Focus less on pricing and prioritize the 90-day timeline..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !feedbackText.trim()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{submitting ? 'Retaining...' : 'Submit & Retain Lesson'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
