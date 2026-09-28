import React, { useEffect, useState } from 'react';
import {
  Users,
  Brain,
  Calendar,
  MessageSquare,
  Sparkles,
  PlayCircle,
  RefreshCw,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { fetchClients, triggerSeed } from '../lib/api';
import { Client } from '../types';
import { ClientCard } from '../components/client/ClientCard';

interface DashboardProps {
  onOpenDemo?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenDemo }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedNotification, setSeedNotification] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();

    const handleUpdate = () => {
      loadClients();
    };

    window.addEventListener('clientpulse:data-updated', handleUpdate);
    return () => {
      window.removeEventListener('clientpulse:data-updated', handleUpdate);
    };
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await triggerSeed(true);
      setSeedNotification(res.message);
      await loadClients();
      setTimeout(() => setSeedNotification(null), 5000);
    } catch (err: any) {
      console.error('Seed error:', err);
      setSeedNotification('Failed to seed Hindsight banks.');
    } finally {
      setSeeding(false);
    }
  };

  // Compute stats
  const totalInteractions = clients.reduce((acc, c) => acc + (c.interactionCount || 0), 0);
  const activeClients = clients.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {seedNotification && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{seedNotification}</span>
          </div>
          <button
            onClick={() => setSeedNotification(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Agents That Learn Using Hindsight</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            ClientPulse <span className="text-indigo-400">AI</span>
          </h1>

          <p className="text-base text-slate-300 leading-relaxed mb-6 font-normal">
            Your client relationship memory intelligence layer. Remembers every meeting, proposal objection, commitment, and outcome using Hindsight's long-term memory bank—adapting recommendations in real time as new interactions occur.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Interactive Demo Tour</span>
              </button>
            )}

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Syncing...' : 'Reseed Hindsight Demo Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Clients</p>
            <h3 className="text-2xl font-bold text-slate-900">{clients.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Logged Interactions</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalInteractions}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Hindsight Memories</p>
            <h3 className="text-2xl font-bold text-slate-900">Active</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Deals</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeClients}</h3>
          </div>
        </div>
      </div>

      {/* Client List Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Client Accounts & Memory Banks</h2>
            <p className="text-xs text-slate-500">
              Each account maintains an isolated long-term memory bank in Hindsight.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            {clients.length} Accounts Configured
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Loading client memory banks...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
