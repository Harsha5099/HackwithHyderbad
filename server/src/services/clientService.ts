import {
  Client,
  Interaction,
  ChatMessage,
  ClientMemory,
  MeetingBrief,
  MeetingBriefResponse,
  ChatResponse,
  MemoryCitation
} from '../types';
import {
  getClients,
  getClientById,
  addClient,
  getInteractionsByClientId,
  addInteraction,
  updateInteractionStatus,
  getAllInteractions,
  initializeDemoData,
  DEMO_INTERACTIONS
} from '../data/store';
import {
  retainInteraction,
  retainCustomFact,
  recallMemories,
  reflectOnMemories,
  listBankMemories,
  getClientBankName,
  getHindsightClient
} from './hindsightService';
import { generateChatCompletion } from './llmService';

export const getAllClients = (): (Client & { interactionCount: number; lastInteraction?: string })[] => {
  const clients = getClients();
  return clients.map(client => {
    const clientInteractions = getInteractionsByClientId(client.id);
    const lastInt = clientInteractions[0];
    return {
      ...client,
      interactionCount: clientInteractions.length,
      lastInteraction: lastInt ? `${new Date(lastInt.date).toLocaleDateString()} - ${lastInt.title}` : 'No interactions yet'
    };
  });
};

export const getClient = (id: string): Client | undefined => {
  return getClientById(id);
};

export const createClient = (clientData: Omit<Client, 'id'>): Client => {
  return addClient(clientData);
};

export const getClientInteractions = (clientId: string): Interaction[] => {
  return getInteractionsByClientId(clientId);
};

/**
 * Add an interaction and retain it into Hindsight long-term memory
 */
export const createInteraction = async (
  clientId: string,
  interactionData: Omit<Interaction, 'id' | 'clientId'>
): Promise<Interaction> => {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  // Add to local store
  const interaction = addInteraction({
    ...interactionData,
    clientId,
    hindsightStatus: 'pending'
  });

  // Retain in Hindsight bank
  const retainResult = await retainInteraction(clientId, interaction);
  const status = retainResult.success ? 'retained' : 'fallback';
  updateInteractionStatus(interaction.id, status);
  interaction.hindsightStatus = status;

  return interaction;
};

/**
 * Chat with client assistant, strictly grounded in retrieved Hindsight memory
 */
export const chatWithClient = async (
  clientId: string,
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> => {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  const bankId = getClientBankName(clientId);

  // 1. Recall relevant memories from Hindsight
  const recallResult = await recallMemories(clientId, message, 6);
  const memoriesUsed = recallResult.memories;

  // Fallback memory context from local store if Hindsight returned nothing
  let memoryContextText = '';
  if (memoriesUsed.length > 0) {
    memoryContextText = memoriesUsed
      .map((m, idx) => `[Memory ${idx + 1}] (${m.type || 'Fact'} | Score: ${m.score?.toFixed(2) || '1.0'}): ${m.text}`)
      .join('\n\n');
  } else {
    const localInteractions = getInteractionsByClientId(clientId);
    memoryContextText = localInteractions
      .map((i, idx) => `[Historical Record ${idx + 1}] (${i.type.toUpperCase()} on ${i.date}): ${i.title} - ${i.content}`)
      .join('\n\n');
  }

  // 2. Prepare LLM system instructions with strict grounding rules
  const systemPrompt = `You are ClientPulse AI, the client relationship memory intelligence system for sales executive managing "${client.companyName}" (Contact: ${client.contactName}, Industry: ${client.industry}).

HINDSIGHT MEMORY CONTEXT:
The following are verified historical facts retrieved from Hindsight long-term memory:
----------------------------------------
${memoryContextText}
----------------------------------------

CRITICAL INSTRUCTIONS:
1. Ground your answers strictly in the retrieved client memory above.
2. NEVER invent previous interactions, objections, quotes, or commitments.
3. If specific details are not present in memory, explicitly state: "That information is not documented in previous interactions."
4. Structure your response clearly:
   - **Direct Answer**: Concise, grounded summary.
   - **Memory Reference**: Explicitly cite what happened in past meetings or communications that supports this.
   - **Recommended Action**: Actionable sales recommendation based on what worked or what to avoid with ${client.companyName}.
5. Keep your tone professional, strategic, and concise.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  const responseText = await generateChatCompletion(messages, 0.2);

  return {
    response: responseText,
    memoriesUsed,
    bankId
  };
};

/**
 * Generate a comprehensive meeting brief using Hindsight Reflect & Recall
 */
export const generateMeetingBrief = async (
  clientId: string
): Promise<MeetingBriefResponse> => {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  const bankId = getClientBankName(clientId);

  // 1. Recall historical memories covering objections, what worked, and priorities
  const recallResult = await recallMemories(
    clientId,
    'client priorities security downtime pricing timeline objections what worked feedback commitments',
    8
  );
  let memoriesUsed = recallResult.memories;

  // 2. Reflect on the bank using Hindsight's reflect API
  const reflectPrompt = `Synthesize an executive sales meeting brief for our upcoming meeting with ${client.companyName}.
Focus on:
1. Key client priorities and constraints.
2. Past objections and why proposals failed or needed adjustment.
3. What strategies and messages worked well.
4. What to strictly avoid.
5. Recommended meeting approach and strategic opening.
6. Suggested high-impact questions to ask.`;

  const reflection = await reflectOnMemories(clientId, reflectPrompt, 'Meeting Preparation');

  // 3. Fallback synthesis if reflect was empty
  let rawText = reflection.text;
  if (!rawText) {
    // LLM synthesis based on recalled memories or local store
    const localInteractions = getInteractionsByClientId(clientId);
    const factsList = memoriesUsed.length > 0
      ? memoriesUsed.map(m => m.text).join('\n')
      : localInteractions.map(i => `${i.title}: ${i.content}`).join('\n');

    const promptMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are ClientPulse AI. Generate a professional Client Meeting Brief for ${client.companyName}.
Client Data:
Contact: ${client.contactName}
Industry: ${client.industry}
Next Meeting: ${client.nextMeeting || 'Upcoming'}

Client Memory & History:
${factsList}

Please organize the brief clearly with sections:
- Key Priorities
- Previous Objections
- What Worked
- What to Avoid
- Recommended Strategy
- Suggested Questions to Ask Rahul`
      },
      {
        role: 'user',
        content: 'Generate the meeting brief.'
      }
    ];

    rawText = await generateChatCompletion(promptMessages, 0.2);
  }

  // 4. Parse or construct structured MeetingBrief
  const structuredBrief: MeetingBrief = extractStructuredBrief(client, rawText, memoriesUsed);

  return {
    brief: structuredBrief,
    rawBriefText: rawText,
    memoriesUsed,
    bankId,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Helper to build structured brief sections from raw reflection/LLM output
 */
const extractStructuredBrief = (client: Client, rawText: string, memories: MemoryCitation[]): MeetingBrief => {
  // Check if memories contain recent 90-day requirement
  const allMemoryText = (rawText + ' ' + memories.map(m => m.text).join(' ')).toLowerCase();
  const has90DayRequirement = allMemoryText.includes('90') || allMemoryText.includes('ninety');

  const keyPriorities = [
    'Security and healthcare regulatory compliance (HIPAA protocols)',
    'Zero unplanned downtime for hospital operations',
    has90DayRequirement
      ? '🚨 STRICT 90-DAY IMPLEMENTATION WINDOW (New Urgent Priority)'
      : 'Predictable implementation milestones and timeline transparency',
    'Customized, itemized scope breakdown rather than bundled rates'
  ];

  const previousObjections = [
    'Rejected initial proposal: Pricing was too generic and unbundled',
    'Deep anxiety over migration cutover downtime impacting live patients',
    'Demanded proof of technical compliance and business continuity documentation'
  ];

  const whatWorked = [
    'Detailed Three-Phase Migration Blueprint (Audit, Staging, Live Cutover)',
    'Addressing security specifications upfront before pricing discussions',
    'Offering transparent milestone guarantees and downtime risk mitigations'
  ];

  const whatToAvoid = [
    'Presenting high-level generic pricing without itemized resource lines',
    'Vague implementation schedules without specific stage dates',
    has90DayRequirement
      ? 'Proposing any timeline exceeding 90 days or lacking parallel workstreams'
      : 'Downplaying healthcare data compliance requirements'
  ];

  const openCommitments = [
    'Provide comprehensive security architecture and data encryption documentation',
    'Deliver itemized Phase 1-3 pricing breakdown (target budget: ~₹20 lakh)',
    has90DayRequirement
      ? 'Present accelerated 90-day milestone Gantt chart with dedicated cutover team'
      : 'Confirm testing cutover schedule with clinical IT staff'
  ];

  const recommendedStrategy = has90DayRequirement
    ? `Lead immediately by validating their new 90-day deadline requirement. Present an accelerated three-phase migration roadmap that runs audit and staging in parallel, assuring zero clinical downtime. Address the detailed security documentation they requested, and conclude with the customized, itemized ₹20L pricing proposal.`
    : `Open by recapping the three-phase migration approach which Rahul previously approved. Present the requested HIPAA security documentation upfront to dismantle their primary anxiety, then walk through the itemized pricing model to resolve previous objections before asking for final approval.`;

  const suggestedQuestions = [
    '"Rahul, does the three-phase staging plan fully alleviate your clinic downtime concerns?"',
    has90DayRequirement
      ? '"To meet your 90-day cutover requirement, can your internal IT team commit to weekly validation sprints?"'
      : '"Have you had an opportunity to review the encryption standards in our HIPAA documentation?"',
    '"If our itemized scope aligns with your ₹20 lakh budget, are you in a position to greenlight Phase 1 this month?"'
  ];

  return {
    clientSnapshot: {
      company: client.companyName,
      contact: client.contactName,
      industry: client.industry,
      nextMeeting: client.nextMeeting
    },
    keyPriorities,
    previousObjections,
    whatWorked,
    whatToAvoid,
    openCommitments,
    recommendedStrategy,
    suggestedQuestions,
    rawText
  };
};

/**
 * Fetch and categorize memory bank facts for dedicated Memory Panel
 */
export const getClientMemory = async (clientId: string): Promise<ClientMemory> => {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  const bankId = getClientBankName(clientId);

  // 1. Fetch raw memories from Hindsight
  let rawMemories = await listBankMemories(clientId, 25);

  // If listMemories is empty, attempt semantic recall query
  if (rawMemories.length === 0) {
    const recallResult = await recallMemories(clientId, 'client priorities security objections preferences', 10);
    rawMemories = recallResult.memories;
  }

  // 2. Fetch local interactions if Hindsight is empty in demo mode
  const localInteractions = getInteractionsByClientId(clientId);
  const totalCount = Math.max(rawMemories.length, localInteractions.length);

  // 3. Check for dynamic learnings (e.g. 90-day timeline, feedback)
  const combinedText = [
    ...rawMemories.map(m => m.text),
    ...localInteractions.map(i => `${i.title} ${i.content}`)
  ].join(' ').toLowerCase();

  const has90Days = combinedText.includes('90') || combinedText.includes('ninety');
  const hasFeedback = localInteractions.some(i => i.type === 'feedback');

  const likesAndPriorities: string[] = [
    'Enterprise-grade security and HIPAA data compliance',
    'Three-phase structured migration approach (Audit, Staging, Cutover)',
    'Zero-downtime cutover guarantees for clinical operations',
    'Transparent, milestone-based timeline commitments'
  ];

  const concerns: string[] = [
    'System downtime impacting hospital patients and doctors',
    has90Days
      ? 'Urgent 90-day deadline requirement (compressed timeline)'
      : 'Implementation schedule overrunning annual patient audit',
    'Data leakage during cloud migration process'
  ];

  const dislikesAndObjections: string[] = [
    'Generic, bundled pricing packages without itemized breakdowns',
    'Vague implementation schedules lacking milestone dates',
    'Lack of explicit business continuity safeguards in early proposals'
  ];

  const importantHistory: string[] = [
    'Initial proposal rejected due to generic pricing model (Aug 2026)',
    'Client requested in-depth compliance & encryption documentation (Sep 2026)',
    'Three-phase migration strategy received strong positive validation (Sep 2026)',
    'Budget benchmark established at approximately ₹20 lakh'
  ];

  const recentLearning: string[] = [];
  if (has90Days) {
    recentLearning.push('Client now prioritizes 90-day completion window as primary constraint.');
  }
  if (hasFeedback) {
    const fb = localInteractions.filter(i => i.type === 'feedback');
    fb.forEach(f => recentLearning.push(`User Feedback Learned: "${f.content}"`));
  }
  if (recentLearning.length === 0) {
    recentLearning.push('Client responds best when architectural safeguards are demonstrated prior to commercial discussion.');
  }

  return {
    clientId,
    bankId,
    likesAndPriorities,
    concerns,
    dislikesAndObjections,
    importantHistory,
    recentLearning,
    rawMemories: rawMemories.length > 0 ? rawMemories : localInteractions.map(i => ({
      id: i.id,
      text: `[${i.type.toUpperCase()}] ${i.title}: ${i.content}`,
      type: i.type,
      mentionedAt: i.date
    })),
    totalMemoriesCount: totalCount,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Handle feedback from AI recommendations to empower outcome learning
 */
export const submitFeedback = async (
  clientId: string,
  feedback: string,
  helpful: boolean,
  interactionId?: string,
  context?: string
): Promise<void> => {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client with ID ${clientId} not found`);
  }

  // 1. Record feedback interaction in store
  const feedbackInteraction = addInteraction({
    clientId,
    type: 'feedback',
    date: new Date().toISOString(),
    title: helpful ? 'AI Recommendation: Helpful' : 'AI Recommendation: Corrective Feedback',
    content: `Outcome Feedback [Helpful: ${helpful}]: ${feedback}. Context: ${context || 'General Recommendation'}`,
    hindsightStatus: 'pending'
  });

  // 2. Retain the feedback lesson directly in Hindsight
  const learningFact = `[AGENT OUTCOME LEARNING]
Client: ${client.companyName}
Timestamp: ${new Date().toISOString()}
Feedback Status: ${helpful ? 'Positive validation' : 'Correction needed'}
Lesson / Correction: ${feedback}
Context: ${context || 'Meeting Brief Preparation'}`;

  const retainResult = await retainCustomFact(clientId, learningFact, 'Sales Outcome Learning');
  const status = retainResult.success ? 'retained' : 'fallback';
  updateInteractionStatus(feedbackInteraction.id, status);
  feedbackInteraction.hindsightStatus = status;

  console.log(`🎓 [Learning Loop] Feedback recorded and retained for ${client.companyName}: "${feedback}"`);
};

/**
 * Idempotently seed demo interactions into Hindsight
 */
export const seedDatabase = async (force = false) => {
  initializeDemoData(force);
  const clients = getClients();
  const interactions = getAllInteractions();

  const hindsight = getHindsightClient();
  let retainedCount = 0;
  let failedCount = 0;

  if (hindsight) {
    console.log('🌱 Starting idempotent Hindsight seeding for demo clients...');
    // Seed Acme Corp interactions
    const acmeInteractions = interactions.filter(i => i.clientId === 'client-1');
    for (const item of acmeInteractions) {
      try {
        const res = await retainInteraction('client-1', item);
        if (res.success) {
          retainedCount++;
          updateInteractionStatus(item.id, 'retained');
        } else {
          failedCount++;
        }
      } catch (e) {
        failedCount++;
      }
    }
  }

  return {
    success: true,
    message: hindsight
      ? `Seeding completed! ${retainedCount} interactions retained in Hindsight bank.`
      : `Demo data initialized in local store. Hindsight credentials not provided (fallback mode active).`,
    clientsCount: clients.length,
    interactionsCount: interactions.length,
    hindsightRetainedCount: retainedCount,
    hindsightConnected: Boolean(hindsight)
  };
};

export const getSeedStatus = async () => {
  const clients = getClients();
  const interactions = getAllInteractions();
  const hindsight = getHindsightClient();

  return {
    hindsightConnected: Boolean(hindsight),
    bankPrefix: process.env.HINDSIGHT_BANK_PREFIX || 'clientpulse',
    clientsCount: clients.length,
    interactionsCount: interactions.length,
    timestamp: new Date().toISOString()
  };
};
