import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain, RefreshCw, X } from 'lucide-react';
import {
  fetchClient,
  fetchInteractions,
  addInteraction,
  chatWithClient,
  generateMeetingBrief,
  fetchClientMemory,
  submitFeedback
} from '../lib/api';
import {
  Client,
  Interaction,
  ChatMessage,
  ClientMemory,
  MeetingBriefResponse,
  MemoryCitation
} from '../types';

import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { OverviewTab } from '../components/workspace/OverviewTab';
import { InteractionsTab } from '../components/workspace/InteractionsTab';
import { ChatTab } from '../components/workspace/ChatTab';
import { BriefTab } from '../components/workspace/BriefTab';
import { MemoryTab } from '../components/workspace/MemoryTab';
import { AddInteractionModal } from '../components/workspace/AddInteractionModal';
import { FeedbackModal } from '../components/workspace/FeedbackModal';

export const ClientWorkspacePage: React.FC = () => {
  const { clientId = 'client-1' } = useParams<{ clientId: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'chat' | 'brief' | 'memory'>('overview');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addingInteraction, setAddingInteraction] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Notifications
  const [memoryNotification, setMemoryNotification] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [lastMemoriesUsed, setLastMemoriesUsed] = useState<MemoryCitation[]>([]);
  const [expandedMemories, setExpandedMemories] = useState<Record<number, boolean>>({});

  // Brief State
  const [briefResponse, setBriefResponse] = useState<MeetingBriefResponse | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean | null>(null);

  // Memory Panel State
  const [clientMemory, setClientMemory] = useState<ClientMemory | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientData, interactionsData] = await Promise.all([
        fetchClient(clientId),
        fetchInteractions(clientId)
      ]);
      setClient(clientData);
      setInteractions(interactionsData);
    } catch (err) {
      console.error('Failed to load client workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleTourNavigate = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('clientpulse:navigate-tab', handleTourNavigate);

    const handleUpdate = () => {
      loadData();
      if (activeTab === 'memory') loadMemory();
    };
    window.addEventListener('clientpulse:data-updated', handleUpdate);

    return () => {
      window.removeEventListener('clientpulse:navigate-tab', handleTourNavigate);
      window.removeEventListener('clientpulse:data-updated', handleUpdate);
    };
  }, [clientId]);

  useEffect(() => {
    if (activeTab === 'brief' && !briefResponse) {
      handleGenerateBrief();
    }
    if (activeTab === 'memory') {
      loadMemory();
    }
  }, [activeTab]);

  const loadMemory = async () => {
    try {
      setMemoryLoading(true);
      const mem = await fetchClientMemory(clientId);
      setClientMemory(mem);
    } catch (err) {
      console.error('Failed to load memory:', err);
    } finally {
      setMemoryLoading(false);
    }
  };

  const handleGenerateBrief = async () => {
    try {
      setBriefLoading(true);
      setFeedbackSubmitted(null);
      const res = await generateMeetingBrief(clientId);
      setBriefResponse(res);
    } catch (err) {
      console.error('Failed to generate brief:', err);
    } finally {
      setBriefLoading(false);
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const newHistory: ChatMessage[] = [...chatMessages, { role: 'user', content: textToSend }];
    setChatMessages(newHistory);
    if (!customMessage) setChatInput('');
    setChatLoading(true);

    try {
      const res = await chatWithClient(clientId, textToSend, chatMessages);
      const updated: ChatMessage[] = [...newHistory, { role: 'assistant', content: res.response }];
      setChatMessages(updated);
      setLastMemoriesUsed(res.memoriesUsed);
      setExpandedMemories(prev => ({ ...prev, [updated.length - 1]: true }));
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Failed to process request with client memory. Please try again.' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCreateInteraction = async (data: {
    title: string;
    type: Interaction['type'];
    content: string;
    date: string;
  }) => {
    try {
      setAddingInteraction(true);
      const newInt = await addInteraction(clientId, data);
      setInteractions(prev => [newInt, ...prev]);
      setIsAddModalOpen(false);

      setMemoryNotification('🧠 Memory updated! New interaction retained into Hindsight bank.');
      setTimeout(() => setMemoryNotification(null), 6000);

      if (clientMemory) loadMemory();
      setBriefResponse(null); // Reset so regeneration reflects the new interaction!
    } catch (err) {
      console.error('Failed to add interaction:', err);
    } finally {
      setAddingInteraction(false);
    }
  };

  const handleFeedbackSubmit = async (helpful: boolean, feedbackTextParam?: string) => {
    try {
      setSubmittingFeedback(true);
      await submitFeedback(
        clientId,
        feedbackTextParam || (helpful ? 'Accurate and comprehensive strategy.' : 'Strategy needs adjustment.'),
        helpful,
        undefined,
        'Meeting Brief Feedback'
      );
      setFeedbackSubmitted(helpful);
      setShowFeedbackModal(false);
      setMemoryNotification('🎓 Feedback retained in Hindsight! The agent will incorporate this learning into future reasoning.');
      setTimeout(() => setMemoryNotification(null), 6000);
      loadMemory();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading || !client) {
    return (
      <div className="py-24 text-center">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-500 font-medium">Accessing client memory bank...</p>
      </div>
    );
  }

  const bankName = `hok-${client.id}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {memoryNotification && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">{memoryNotification}</span>
          </div>
          <button onClick={() => setMemoryNotification(null)} className="text-white/80 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Clients</span>
        </Link>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600 border border-slate-200">
          <Brain className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hindsight Bank: <strong>{bankName}</strong></span>
        </div>
      </div>

      {/* Header */}
      <WorkspaceHeader
        client={client}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onPrepareMeeting={() => {
          setActiveTab('brief');
          handleGenerateBrief();
        }}
        interactionCount={interactions.length}
      />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <OverviewTab
          client={client}
          interactions={interactions}
          bankName={bankName}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'interactions' && (
        <InteractionsTab
          interactions={interactions}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {activeTab === 'chat' && (
        <ChatTab
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatLoading={chatLoading}
          onSendMessage={handleSendMessage}
          onClearChat={() => setChatMessages([])}
          lastMemoriesUsed={lastMemoriesUsed}
          expandedMemories={expandedMemories}
          setExpandedMemories={setExpandedMemories}
          companyName={client.companyName}
          bankName={bankName}
        />
      )}

      {activeTab === 'brief' && (
        <BriefTab
          briefResponse={briefResponse}
          briefLoading={briefLoading}
          onGenerateBrief={handleGenerateBrief}
          onHelpfulFeedback={() => handleFeedbackSubmit(true, 'Brief strategy is spot on.')}
          onOpenFeedbackModal={() => setShowFeedbackModal(true)}
          feedbackSubmitted={feedbackSubmitted}
          submittingFeedback={submittingFeedback}
          bankName={bankName}
        />
      )}

      {activeTab === 'memory' && (
        <MemoryTab
          clientMemory={clientMemory}
          memoryLoading={memoryLoading}
          onRefreshMemory={loadMemory}
          bankName={bankName}
        />
      )}

      {/* Modals */}
      <AddInteractionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateInteraction}
        adding={addingInteraction}
        bankName={bankName}
      />

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={text => handleFeedbackSubmit(false, text)}
        submitting={submittingFeedback}
      />
    </div>
  );
};

export default ClientWorkspacePage;
