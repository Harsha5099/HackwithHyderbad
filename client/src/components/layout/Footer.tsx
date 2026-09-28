import React from 'react';
import { Brain, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">ClientPulse AI</span>
            <span>—</span>
            <span>Built for the Hackathon: <em>"AI Agents That Learn Using Hindsight"</em></span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://docs.hindsight.vectorize.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <span>Hindsight Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-1.5 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Tenant Bank Isolation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
