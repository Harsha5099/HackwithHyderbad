import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  User,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Brain,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const isPrimaryDemo = client.id === 'client-1';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Negotiation':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden group ${
        isPrimaryDemo
          ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner for Primary Demo Client */}
      {isPrimaryDemo && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white px-4 py-1 text-[11px] font-semibold tracking-wide flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PRIMARY HACKATHON DEMO CLIENT</span>
          </span>
          <span className="opacity-90 font-mono text-[10px]">Bank: hok-client-1</span>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="inline-block text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 mb-1.5">
              {client.industry}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              {client.companyName}
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(
              client.status
            )}`}
          >
            {client.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            {client.contactName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{client.contactName}</p>
            <p className="text-[11px] text-slate-500">{client.email || 'Contact on file'}</p>
          </div>
        </div>

        {/* Activity & Memory Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[11px] font-medium">Memory Units</span>
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {client.interactionCount || 0} Retained
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[11px] font-medium">Next Meeting</span>
            </div>
            <p className="font-semibold text-slate-800 text-[11px] truncate">
              {client.nextMeeting ? new Date(client.nextMeeting).toLocaleDateString() : 'None Scheduled'}
            </p>
          </div>
        </div>

        {/* Last Interaction Snippet */}
        <div className="text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-1.5 font-medium text-slate-600 mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Latest Interaction:</span>
          </div>
          <p className="text-slate-700 line-clamp-2 italic">
            "{client.lastInteraction || 'No recent interactions logged.'}"
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Isolated Memory Bank</span>
        </span>

        <Link
          to={`/clients/${client.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-all"
        >
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
