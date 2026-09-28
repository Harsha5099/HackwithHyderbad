import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
        <Brain className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
        The requested client account or view does not exist in memory.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm hover:bg-indigo-700"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
