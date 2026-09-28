import { Client, Interaction } from '../types';

let clients: Client[] = [];
let interactions: Interaction[] = [];
let hasInitialized = false;

export const DEMO_CLIENTS: Client[] = [
  {
    id: 'client-1',
    companyName: 'Acme Corp',
    contactName: 'Rahul Sharma',
    industry: 'Healthcare Technology',
    email: 'rahul.sharma@acmecorp.health',
    phone: '+91 98765 43210',
    status: 'Active',
    nextMeeting: '2026-10-02T10:30:00Z',
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'client-2',
    companyName: 'TechNova Solutions',
    contactName: 'Priya Patel',
    industry: 'FinTech & Banking',
    email: 'priya.patel@technova.io',
    phone: '+91 98220 11223',
    status: 'Negotiation',
    nextMeeting: '2026-10-04T14:00:00Z',
    createdAt: '2026-08-10T09:00:00Z'
  },
  {
    id: 'client-3',
    companyName: 'GreenGrid Systems',
    contactName: 'Arjun Mehta',
    industry: 'Clean Energy & IoT',
    email: 'arjun.mehta@greengrid.energy',
    phone: '+91 97110 33445',
    status: 'Active',
    nextMeeting: '2026-10-05T11:00:00Z',
    createdAt: '2026-08-15T11:30:00Z'
  },
  {
    id: 'client-4',
    companyName: 'MediCare Plus',
    contactName: 'Dr. Sneha Reddy',
    industry: 'Hospital Infrastructure',
    email: 'sneha.reddy@medicareplus.org',
    phone: '+91 99440 55667',
    status: 'Lead',
    nextMeeting: '2026-10-08T15:30:00Z',
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'client-5',
    companyName: 'FinEdge Analytics',
    contactName: 'Vikram Singh',
    industry: 'Financial Services',
    email: 'vikram.singh@finedge.capital',
    phone: '+91 98330 77889',
    status: 'Active',
    nextMeeting: '2026-10-10T16:00:00Z',
    createdAt: '2026-08-25T10:00:00Z'
  }
];

export const DEMO_INTERACTIONS: Interaction[] = [
  // Acme Corp historical narrative
  {
    id: 'acme-int-1',
    clientId: 'client-1',
    type: 'meeting',
    date: '2026-08-12T10:00:00Z',
    title: 'Initial Discovery Meeting',
    content: 'Acme Corp is evaluating partners for cloud migration. Rahul Sharma highlighted that security and data privacy are their non-negotiable top priorities due to healthcare compliance. They are deeply worried about system downtime impacting clinic operations. Budget expectation is around ₹20 lakh.',
    hindsightStatus: 'retained'
  },
  {
    id: 'acme-int-2',
    clientId: 'client-1',
    type: 'proposal',
    date: '2026-08-20T14:30:00Z',
    title: 'Proposal Review & Initial Feedback',
    content: 'Acme rejected the first proposal because the pricing model was too generic and lumped all deliverables together. However, Rahul specifically noted that they liked our proposed three-phase migration strategy (Audit, Staging, Cutover).',
    hindsightStatus: 'retained'
  },
  {
    id: 'acme-int-3',
    clientId: 'client-1',
    type: 'email',
    date: '2026-09-02T09:15:00Z',
    title: 'Security Documentation & Compliance Inquiry',
    content: 'Rahul emailed asking for detailed security documentation, specifically HIPAA compliance frameworks, encryption in transit/rest protocols, and business continuity guarantees before submitting proposal v2.',
    hindsightStatus: 'retained'
  },
  {
    id: 'acme-int-4',
    clientId: 'client-1',
    type: 'call',
    date: '2026-09-10T16:00:00Z',
    title: 'Technical Clarification Call',
    content: 'Discussed architectural questions. The client reiterated that predictable implementation timelines are crucial. They cannot afford overrun schedules that collide with their annual patient audit.',
    hindsightStatus: 'retained'
  },
  {
    id: 'acme-int-5',
    clientId: 'client-1',
    type: 'meeting',
    date: '2026-09-18T11:00:00Z',
    title: 'Migration Blueprint Walkthrough',
    content: 'Client responded very positively when our solution architect walked through the three-phase migration approach in detail. They confirmed this mitigates their downtime concerns. Rahul stated that with itemized pricing, they are eager to move forward.',
    hindsightStatus: 'retained'
  },

  // TechNova interactions
  {
    id: 'technova-int-1',
    clientId: 'client-2',
    type: 'meeting',
    date: '2026-08-18T14:00:00Z',
    title: 'Payment Gateway Integration Scope',
    content: 'TechNova is building a cross-border remittance gateway. Their primary requirement is sub-second latency and PCI-DSS Level 1 adherence.',
    hindsightStatus: 'retained'
  },
  {
    id: 'technova-int-2',
    clientId: 'client-2',
    type: 'proposal',
    date: '2026-09-05T15:00:00Z',
    title: 'Architecture Proposal',
    content: 'Priya liked our distributed microservices approach. Requested proof of concept on Kafka event streaming.',
    hindsightStatus: 'retained'
  },

  // GreenGrid interactions
  {
    id: 'greengrid-int-1',
    clientId: 'client-3',
    type: 'call',
    date: '2026-08-28T11:30:00Z',
    title: 'Solar Grid IoT Ingestion Review',
    content: 'Arjun discussed telemetry ingestion from 5,000 smart inverters. High priority on offline caching and MQTT broker scalability.',
    hindsightStatus: 'retained'
  }
];

export const initializeDemoData = (force = false) => {
  if (clients.length === 0 || force) {
    clients = [...DEMO_CLIENTS];
    interactions = [...DEMO_INTERACTIONS];
    hasInitialized = true;
    console.log(`📦 Initialized store with ${clients.length} clients and ${interactions.length} interactions.`);
  }
};

export const getClients = (): Client[] => {
  if (clients.length === 0) initializeDemoData();
  return [...clients];
};

export const getClientById = (id: string): Client | undefined => {
  if (clients.length === 0) initializeDemoData();
  return clients.find(c => c.id === id);
};

export const addClient = (clientData: Omit<Client, 'id'>): Client => {
  const newClient: Client = {
    ...clientData,
    id: `client-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  clients.push(newClient);
  return newClient;
};

export const getInteractionsByClientId = (clientId: string): Interaction[] => {
  if (clients.length === 0) initializeDemoData();
  return interactions
    .filter(i => i.clientId === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addInteraction = (interactionData: Omit<Interaction, 'id'>): Interaction => {
  const newInteraction: Interaction = {
    ...interactionData,
    id: `int-${Date.now()}`
  };
  interactions.push(newInteraction);
  return newInteraction;
};

export const updateInteractionStatus = (id: string, status: 'retained' | 'failed' | 'fallback') => {
  const item = interactions.find(i => i.id === id);
  if (item) {
    item.hindsightStatus = status;
  }
};

export const getAllInteractions = (): Interaction[] => {
  return [...interactions];
};

// Initialize upon store load
initializeDemoData();
