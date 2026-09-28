import React from 'react';
import { Calendar, Brain, PlusCircle } from 'lucide-react';
import { Interaction } from '../../types';

interface InteractionsTabProps {
  interactions: Interaction[];
  onOpenAddModal: () => void;
}

export const InteractionsTab: React.FC<InteractionsTabProps> = ({
  interactions,
  onOpenAddModal
}) => {
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'proposal':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'email':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'call':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'feedback':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Interaction History & Memory Timeline</h3>
          <p className="text-xs text-slate-500">
            Every recorded interaction is retained as a permanent semantic fact in Hindsight.
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log New Interaction</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-6 ml-3">
        {interactions.map(item => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 group-hover:scale-125 transition-transform"></div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getTypeBadgeColor(
                      item.type
                    )}`}
                  >
                    {item.type}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                    <Brain className="w-3 h-3 text-emerald-600" />
                    <span>Retained in Hindsight</span>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
