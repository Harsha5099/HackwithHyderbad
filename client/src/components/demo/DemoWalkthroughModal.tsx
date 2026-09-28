import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Play,
  CheckCircle2,
  Brain,
  MessageSquare,
  FileText,
  PlusCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  ThumbsDown
} from 'lucide-react';
import { addInteraction } from '../../lib/api';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInjecting, setIsInjecting] = useState(false);
  const [interactionInjected, setInteractionInjected] = useState(false);

  if (!isOpen) return null;

  const totalSteps = 6;

  const handleInject90DayInteraction = async () => {
    setIsInjecting(true);
    try {
      await addInteraction('client-1', {
        title: 'Urgent Timeline Requirement Update',
        type: 'call',
        date: new Date().toISOString(),
        content:
          'Acme now says implementation time is their biggest concern. They require the full cloud migration completed within 90 days due to their hospital board review.'
      });
      setInteractionInjected(true);
      window.dispatchEvent(new CustomEvent('clientpulse:data-updated'));
    } catch (err) {
      console.error('Failed to inject interaction:', err);
    } finally {
      setIsInjecting(false);
    }
  };

  const steps = [
    {
      title: 'Step 1: Open Acme Corp Workspace',
      badge: 'Context',
      description:
        'Acme Corp is evaluating cloud migration. Notice their contact is Rahul Sharma (Healthcare Tech). Several previous meetings and calls are already retained in Hindsight bank: hok-client-1.',
      actionText: 'Go to Acme Corp Workspace',
      action: () => {
        navigate('/clients/client-1');
        if (onNavigateToTab) onNavigateToTab('overview');
      }
    },
    {
      title: 'Step 2: Inspect Hindsight Memory Panel',
      badge: 'Persistent Memory',
      description:
        'Navigate to the "Memory Panel" tab. Observe structured sections: LIKES/PRIORITIES (Security, 3-Phase Plan), CONCERNS (Downtime), DISLIKES (Generic pricing), and historical memory facts.',
      actionText: 'View Memory Panel Tab',
      action: () => {
        navigate('/clients/client-1');
        if (onNavigateToTab) onNavigateToTab('memory');
      }
    },
    {
      title: 'Step 3: Grounded Recall Query in AI Chat',
      badge: 'Accurate Recall',
      description:
        'Go to the AI Assistant tab and ask: "Why did Acme reject our previous proposal?" The assistant will consult Hindsight memories and accurately explain the generic pricing objection without making things up.',
      actionText: 'Open AI Assistant Tab',
      action: () => {
        navigate('/clients/client-1');
        if (onNavigateToTab) onNavigateToTab('chat');
      }
    },
    {
      title: 'Step 4: Generate Baseline Meeting Brief',
      badge: 'Hindsight Reflect',
      description:
        'Click the "Meeting Brief" tab. The system calls Hindsight reflect to construct an executive briefing showing what worked, what to avoid, and recommending a 3-phase opening.',
      actionText: 'View Baseline Meeting Brief',
      action: () => {
        navigate('/clients/client-1');
        if (onNavigateToTab) onNavigateToTab('brief');
      }
    },
    {
      title: 'Step 5: The Learning Demonstration (Add New Interaction)',
      badge: 'Retain & Learn',
      description:
        'Simulate a new interaction: Rahul calls and states that their biggest concern is now completing the migration within 90 days. Click the button below to retain this into Hindsight in real time!',
      actionText: interactionInjected
        ? '✓ 90-Day Requirement Retained in Hindsight!'
        : isInjecting
        ? 'Retaining in Hindsight...'
        : '⚡ Inject New 90-Day Interaction',
      action: handleInject90DayInteraction,
      disabled: interactionInjected || isInjecting
    },
    {
      title: 'Step 6: Re-generate Meeting Brief & Outcome Learning',
      badge: 'Adaptive Intelligence',
      description:
        'Now return to the "Meeting Brief" tab. Generate the brief again! Notice how the AI incorporates the 90-day deadline into priorities, avoids schedule delays, and restructures the recommended strategy. Then test the [Not Helpful] feedback loop!',
      actionText: 'Check Adapted Meeting Brief',
      action: () => {
        navigate('/clients/client-1');
        if (onNavigateToTab) onNavigateToTab('brief');
        onClose();
      }
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Brain className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-white">Hackathon Demo Tour</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Demonstrating Hindsight Memory & Real-Time Learning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i + 1 <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {current.badge}
            </span>
            <h4 className="font-bold text-slate-900 text-base">{current.title}</h4>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {current.description}
          </p>

          {/* Action Button for Current Step */}
          <div className="mb-6">
            <button
              onClick={current.action}
              disabled={current.disabled}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous Step
            </button>

            <span className="font-medium text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>

            <button
              onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
              disabled={currentStep === totalSteps}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
