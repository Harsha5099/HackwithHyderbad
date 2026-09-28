import dotenv from 'dotenv';
dotenv.config();

import { HindsightClient } from '@vectorize-io/hindsight-client';
import { Interaction, MemoryCitation } from '../types';

let hindsightClient: HindsightClient | null = null;
let isInitialized = false;

/**
 * Initialize Hindsight client if credentials are configured
 */
export const initializeHindsight = (): HindsightClient | null => {
  if (isInitialized && hindsightClient) {
    return hindsightClient;
  }

  const baseUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
  const apiKey = process.env.HINDSIGHT_API_KEY;

  if (baseUrl && apiKey) {
    try {
      hindsightClient = new HindsightClient({
        baseUrl,
        apiKey
      });
      isInitialized = true;
      console.log('✅ Hindsight client initialized with BaseURL:', baseUrl);
      return hindsightClient;
    } catch (error) {
      console.error('❌ Failed to initialize Hindsight client:', error);
      hindsightClient = null;
      return null;
    }
  } else {
    console.warn('⚠️ Hindsight credentials not provided. Running in Demo/Fallback mode.');
    return null;
  }
};

export const getHindsightClient = (): HindsightClient | null => {
  if (!hindsightClient && !isInitialized) {
    return initializeHindsight();
  }
  return hindsightClient;
};

/**
 * Generate an isolated bank name per client
 * Format: [HINDSIGHT_BANK_PREFIX]-[clientId]
 */
export const getClientBankName = (clientId: string): string => {
  const bankPrefix = process.env.HINDSIGHT_BANK_PREFIX || 'clientpulse';
  return `${bankPrefix}-${clientId}`.toLowerCase();
};

/**
 * Retain an interaction into Hindsight long-term memory
 */
export const retainInteraction = async (
  clientId: string,
  interaction: Interaction
): Promise<{ success: boolean; bankId: string; response?: any }> => {
  const client = getHindsightClient();
  const bankId = getClientBankName(clientId);

  if (!client) {
    console.warn(`Hindsight not available, skipped retaining for ${bankId}`);
    return { success: false, bankId };
  }

  // Format durable fact memory for high-quality semantic recall & reflection
  const formattedContent = `[Interaction Date: ${interaction.date}]
[Client ID: ${clientId}]
[Type: ${interaction.type.toUpperCase()}]
[Title: ${interaction.title}]

Content & Observations:
${interaction.content}`;

  try {
    const res = await client.retain(bankId, formattedContent.trim(), {
      timestamp: interaction.date ? new Date(interaction.date).toISOString() : new Date().toISOString(),
      context: `Client Interaction: ${interaction.title}`,
      metadata: {
        interactionId: String(interaction.id),
        clientId: String(clientId),
        type: String(interaction.type),
        title: String(interaction.title)
      },
      async: false
    });

    console.log(`🧠 [Hindsight Retain] Retained in bank ${bankId}: "${interaction.title}"`);
    return { success: true, bankId, response: res };
  } catch (error: any) {
    console.error(`❌ [Hindsight Retain Error] Failed to retain for ${bankId}:`, error.message || error);
    return { success: false, bankId };
  }
};

/**
 * Retain arbitrary learning memory (e.g. user feedback, updated strategy outcomes)
 */
export const retainCustomFact = async (
  clientId: string,
  factText: string,
  contextTitle: string = 'User Feedback / Outcome Learning'
): Promise<{ success: boolean; bankId: string }> => {
  const client = getHindsightClient();
  const bankId = getClientBankName(clientId);

  if (!client) {
    return { success: false, bankId };
  }

  try {
    await client.retain(bankId, factText.trim(), {
      timestamp: new Date().toISOString(),
      context: contextTitle,
      metadata: {
        type: 'feedback',
        source: 'user_learning'
      },
      async: false
    });
    console.log(`🧠 [Hindsight Retain Fact] Stored in bank ${bankId}: "${factText}"`);
    return { success: true, bankId };
  } catch (error: any) {
    console.error(`❌ [Hindsight Retain Fact Error] Failed for ${bankId}:`, error.message || error);
    return { success: false, bankId };
  }
};

/**
 * Recall memories from Hindsight using semantic & reranker search
 */
export const recallMemories = async (
  clientId: string,
  query: string,
  maxResults = 6
): Promise<{ memories: MemoryCitation[]; entities: string[]; rawCount: number }> => {
  const client = getHindsightClient();
  const bankId = getClientBankName(clientId);

  if (!client) {
    return { memories: [], entities: [], rawCount: 0 };
  }

  try {
    const response = await client.recall(bankId, query, {
      maxTokens: 2048,
      includeEntities: true
    });

    const results = response.results || [];
    const entityKeys = response.entities ? Object.keys(response.entities) : [];

    const citations: MemoryCitation[] = results.slice(0, maxResults).map(r => ({
      id: r.id,
      text: r.text,
      type: r.type || 'fact',
      entities: r.entities || [],
      context: r.context || undefined,
      score: (r as any).scores?.reranker || (r as any).scores?.final || 1.0,
      mentionedAt: r.mentioned_at || undefined
    }));

    return {
      memories: citations,
      entities: entityKeys,
      rawCount: results.length
    };
  } catch (error: any) {
    console.error(`❌ [Hindsight Recall Error] Failed to recall for ${bankId}:`, error.message || error);
    return { memories: [], entities: [], rawCount: 0 };
  }
};

/**
 * Reflect on memories to generate high-level synthesis, reasoning, or recommendations
 */
export const reflectOnMemories = async (
  clientId: string,
  prompt: string,
  context?: string
): Promise<{ text: string; basedOn: MemoryCitation[] }> => {
  const client = getHindsightClient();
  const bankId = getClientBankName(clientId);

  if (!client) {
    return { text: '', basedOn: [] };
  }

  try {
    const res = await client.reflect(bankId, prompt, {
      context: context || 'Client Relationship Management'
    });

    const text = res.text || '';
    const basedOn: MemoryCitation[] = (res.based_on || []).map(b => ({
      id: b.id || undefined,
      text: b.text,
      type: b.type || undefined,
      context: b.context || undefined
    }));

    return { text, basedOn };
  } catch (error: any) {
    console.error(`❌ [Hindsight Reflect Error] Failed to reflect for ${bankId}:`, error.message || error);
    return { text: '', basedOn: [] };
  }
};

/**
 * List all raw stored memory units from the bank
 */
export const listBankMemories = async (
  clientId: string,
  limit = 20
): Promise<MemoryCitation[]> => {
  const client = getHindsightClient();
  const bankId = getClientBankName(clientId);

  if (!client) {
    return [];
  }

  try {
    const res = await client.listMemories(bankId, { limit });
    const items = res.items || [];
    return items.map((item: any) => ({
      id: item.id,
      text: item.text || item.content || JSON.stringify(item),
      type: item.type || 'memory_unit',
      entities: item.entities || [],
      context: item.context || undefined,
      mentionedAt: item.mentioned_at || item.created_at || undefined
    }));
  } catch (error: any) {
    console.error(`❌ [Hindsight ListMemories Error] Failed for ${bankId}:`, error.message || error);
    return [];
  }
};

// Automatically attempt initialization upon module load
initializeHindsight();
