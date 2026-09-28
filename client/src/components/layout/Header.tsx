import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Sparkles, Database, PlayCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { triggerSeed } from '../../lib/api';

interface HeaderProps {
  onOpenDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemo }) => {
  const location = useLocation();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await triggerSeed(true);
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
      console.log('Seeded successfully:', res);
      // Reload page if on dashboard or workspace to refresh data
      window.dispatchEvent(new CustomEvent('clientpulse:data-updated'));
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    ClientPulse <span className="text-indigo-600 font-extrabold">AI</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                    Hindsight Memory
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Your AI client relationship memory
                </p>
              </div>
            </Link>
          </div>

          {/* Center Navigation & Active Status */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Brain className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hindsight Long-Term Memory Live</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Groq LLM Connected</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Run Demo Tour</span>
              </button>
            )}

            <button
              onClick={handleSeed}
              disabled={seeding}
              title="Idempotently seed demo interactions into Hindsight"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Seeding...' : seedSuccess ? 'Memories Seeded!' : 'Seed Hindsight'}</span>
            </button>

            <Link
              to="/"
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-200/80 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Clients
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
