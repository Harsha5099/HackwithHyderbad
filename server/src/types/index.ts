export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  industry: string;
  email?: string;
  phone?: string;
  status: 'Active' | 'Lead' | 'Negotiation' | 'Closed';
  nextMeeting?: string;
  createdAt?: string;
}

export interface Interaction {
  id: string;
  clientId: string;
  type: 'meeting' | 'email' | 'call' | 'proposal' | 'feedback' | 'note';
  date: string; // ISO string
  title: string;
  content: string;
  hindsightStatus?: 'retained' | 'pending' | 'failed' | 'fallback';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MemoryCitation {
  id?: string;
  text: string;
  type?: string;
  entities?: string[];
  context?: string;
  score?: number;
  mentionedAt?: string;
}

export interface ClientMemory {
  clientId: string;
  bankId: string;
  likesAndPriorities: string[];
  concerns: string[];
  dislikesAndObjections: string[];
  importantHistory: string[];
  recentLearning: string[];
  rawMemories: MemoryCitation[];
  totalMemoriesCount: number;
  lastUpdated: string;
}

export interface MeetingBrief {
  clientSnapshot: {
    company: string;
    contact: string;
    industry: string;
    nextMeeting?: string;
  };
  keyPriorities: string[];
  previousObjections: string[];
  whatWorked: string[];
  whatToAvoid: string[];
  openCommitments: string[];
  recommendedStrategy: string;
  suggestedQuestions: string[];
  rawText?: string;
}

export interface ChatResponse {
  response: string;
  memoriesUsed: MemoryCitation[];
  bankId: string;
}

export interface MeetingBriefResponse {
  brief: MeetingBrief;
  rawBriefText?: string;
  memoriesUsed: MemoryCitation[];
  bankId: string;
  generatedAt: string;
}

export interface FeedbackRequest {
  feedback: string;
  helpful: boolean;
  interactionId?: string;
  context?: string;
}