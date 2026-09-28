import React from 'react';
import { Building2, Clock, Brain, Shield, Sparkles } from 'lucide-react';
import { Client, Interaction } from '../../types';

interface OverviewTabProps {
  client: Client;
  interactions: Interaction[];
  bankName: string;
  onNavigateTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  client,
  interactions,
  bankName,
  onNavigateTab
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Relationship Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Relationship Overview</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {client.companyName} is in negotiations for an enterprise cloud migration. Decision-maker {client.contactName} emphasizes healthcare security protocols and minimal system downtime. While early bundled pricing was rejected, they validated the proposed three-phase migration approach.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-1">Target Budget</span>
              <span className="font-bold text-slate-800">~ ₹20 Lakh</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block mb-1">Core Constraint</span>
              <span className="font-bold text-slate-800">Zero Clinical Downtime</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-slate-500 block mb-1">Next Meeting</span>
              <span className="font-bold text-slate-800">
                {client.nextMeeting ? new Date(client.nextMeeting).toLocaleDateString() : 'TBD'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Timeline Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Recent Interactions</span>
            </h3>
            <button
              onClick={() => onNavigateTab('interactions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({interactions.length})
            </button>
          </div>

          <div className="space-y-3">
            {interactions.slice(0, 3).map(i => (
              <div
                key={i.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs"
              >
                <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wide bg-indigo-100 text-indigo-800">
                  {i.type}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{i.title}</h4>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(i.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-2">{i.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: AI Assistant Teaser & Hindsight Bank Status */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold mb-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Hindsight Intelligence</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Need meeting prep?</h3>
          <p className="text-xs text-indigo-200 leading-relaxed mb-4">
            The AI assistant synthesizes past objections, commitments, and timeline requirements stored in Hindsight memory.
          </p>
          <button
            onClick={() => onNavigateTab('brief')}
            className="w-full py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Generate Meeting Brief</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-xs space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Memory Isolation Bank</span>
          </h4>
          <p className="text-slate-500">
            Client history is maintained in an isolated Hindsight memory bank: <code>{bankName}</code>.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
            <span>Stored units</span>
            <span className="font-bold text-slate-800">{interactions.length} interactions</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Vectorize Engine</span>
            <span className="font-semibold text-emerald-600 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Connected</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
