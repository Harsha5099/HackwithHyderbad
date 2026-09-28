import React, { useState } from 'react';
import { X, RefreshCw, Brain } from 'lucide-react';
import { Interaction } from '../../types';

interface AddInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: Interaction['type'];
    content: string;
    date: string;
  }) => Promise<void>;
  adding: boolean;
  bankName: string;
}

export const AddInteractionModal: React.FC<AddInteractionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  adding,
  bankName
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Interaction['type']>('meeting');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await onSubmit({ title, type, content, date });
    setTitle('');
    setContent('');
  };

  const handleFillDemoText = () => {
    setTitle('Timeline & Completion Constraint');
    setType('call');
    setContent(
      'Acme now says implementation time is their biggest concern. They want the migration completed within 90 days due to their board review.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Add Interaction & Retain in Memory</h3>
            <p className="text-xs text-slate-500">
              Will be persisted and retained in Hindsight bank: {bankName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interaction Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Migration Scope Revision Call"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interaction Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as Interaction['type'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="meeting">Meeting</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="proposal">Proposal</option>
                <option value="feedback">Feedback</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Content / Notes / New Priorities
              </label>
              <button
                type="button"
                onClick={handleFillDemoText}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + Fill Demo 90-Day Text
              </button>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Describe facts, objections, requests, or new commitments..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            >
              {adding ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Retaining in Hindsight...</span>
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  <span>Save & Retain Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
