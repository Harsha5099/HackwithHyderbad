import React from 'react';
import { Building2, User, Sparkles, PlusCircle, FileText, Brain } from 'lucide-react';
import { Client } from '../../types';

interface WorkspaceHeaderProps {
  client: Client;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onOpenAddModal: () => void;
  onPrepareMeeting: () => void;
  interactionCount: number;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  client,
  activeTab,
  onTabChange,
  onOpenAddModal,
  onPrepareMeeting,
  interactionCount
}) => {
  const isPrimary = client.id === 'client-1';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {client.industry}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              {client.status}
            </span>
            {isPrimary && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>PRIMARY DEMO ACCOUNT</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-3">
            <span>{client.companyName}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center space-x-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span>Contact: {client.contactName}</span>
            </div>
            <span>•</span>
            <div>{client.email}</div>
            <span>•</span>
            <div>{client.phone}</div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Add Interaction</span>
          </button>

          <button
            onClick={onPrepareMeeting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-100 transition-all hover:shadow"
          >
            <FileText className="w-4 h-4" />
            <span>Prepare Me for Meeting</span>
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-slate-200 mt-8 overflow-x-auto gap-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'interactions', label: `Interactions (${interactionCount})` },
          { id: 'chat', label: 'AI Assistant' },
          { id: 'brief', label: 'Meeting Brief' },
          { id: 'memory', label: 'Memory Panel', badge: 'Hindsight' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
