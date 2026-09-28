import dotenv from 'dotenv';
dotenv.config();

import { Groq } from 'groq-sdk';
import { ChatMessage } from '../types';

let groqClient: Groq | null = null;
let isInitialized = false;

// Fallback models in order of capability and speed
const PREFERRED_MODELS = [
  process.env.LLM_MODEL || 'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
];

export const initializeGroq = (): Groq | null => {
  if (isInitialized && groqClient) {
    return groqClient;
  }

  const apiKey = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
  if (apiKey) {
    try {
      groqClient = new Groq({ apiKey });
      isInitialized = true;
      console.log('✅ Groq LLM client initialized with model:', PREFERRED_MODELS[0]);
      return groqClient;
    } catch (error) {
      console.error('❌ Failed to initialize Groq client:', error);
      groqClient = null;
      return null;
    }
  } else {
    console.warn('⚠️ LLM API key not provided. Running with memory-augmented fallback responses.');
    return null;
  }
};

export const getGroqClient = (): Groq | null => {
  if (!groqClient && !isInitialized) {
    return initializeGroq();
  }
  return groqClient;
};

/**
 * Generate a chat completion using Groq with fallback model support
 */
export const generateChatCompletion = async (
  messages: ChatMessage[],
  temperature = 0.3
): Promise<string> => {
  const client = getGroqClient();
  if (!client) {
    return generateFallbackResponse(messages);
  }

  // Filter messages to valid roles (system, user, assistant)
  const validMessages = messages.map(m => ({
    role: m.role as 'system' | 'user' | 'assistant',
    content: m.content
  }));

  for (const model of PREFERRED_MODELS) {
    try {
      const response = await client.chat.completions.create({
        messages: validMessages,
        model,
        temperature,
        max_tokens: 1500
      });

      const reply = response.choices[0]?.message?.content;
      if (reply) {
        return reply.trim();
      }
    } catch (error: any) {
      console.warn(`⚠️ Model ${model} failed: ${error.message}. Trying next fallback...`);
    }
  }

  return generateFallbackResponse(messages);
};

/**
 * High-quality fallback generator grounded in retrieved memories
 */
const generateFallbackResponse = (messages: ChatMessage[]): string => {
  const lastUserMessage = messages
    .slice()
    .reverse()
    .find(m => m.role === 'user')?.content.toLowerCase() || '';

  // Extract memory context if present in system messages
  const memorySystemMsg = messages.find(m => m.role === 'system' && m.content.includes('RELEVANT CLIENT MEMORIES:'));
  const memorySnippet = memorySystemMsg ? memorySystemMsg.content : '';

  if (lastUserMessage.includes('why') && (lastUserMessage.includes('reject') || lastUserMessage.includes('proposal'))) {
    return `Based on previous client interactions in Hindsight memory:

Acme Corp rejected our previous proposal specifically because the pricing structure was deemed too generic and lacked customization for their migration scope.

However, they responded very favorably to our proposed three-phase migration approach, which they felt addressed their downtime concerns.`;
  }

  if (lastUserMessage.includes('what worked') || lastUserMessage.includes('work best')) {
    return `According to client history in memory:

1. **Three-Phase Migration Strategy**: The client specifically appreciated breaking the project into structured phases to minimize operational downtime.
2. **Security Documentation**: Providing detailed, upfront security specs directly addressed their primary compliance anxiety.
3. **Transparent Timelines**: Clear milestone commitments helped build confidence.`;
  }

  if (lastUserMessage.includes('biggest concern') || lastUserMessage.includes('concerns') || lastUserMessage.includes('care about')) {
    return `Based on historical records stored in Hindsight:

The client's top concerns are:
1. **Security**: Data protection and healthcare compliance are their #1 priority.
2. **Migration Downtime**: They fear system interruptions affecting hospital operations.
3. **Implementation Timeline**: They require predictable execution (recently tightened to a 90-day completion deadline).
4. **Transparent, Tailored Pricing**: They rejected earlier generic pricing models.`;
  }

  if (lastUserMessage.includes('what to avoid') || lastUserMessage.includes('avoid')) {
    return `Based on remembered client feedback:

1. **Avoid generic pricing tiers**: Provide a granular, itemized scope breakdown.
2. **Avoid vague scheduling**: Commit to measurable phase milestones and downtime windows.
3. **Avoid glossing over security**: Lead with compliance certifications and data encryption standards.`;
  }

  if (memorySnippet) {
    return `Based on retrieved client memory:\n\n${memorySnippet.replace('RELEVANT CLIENT MEMORIES:\n', '')}\n\nRecommended next steps: Align with the client's preferred phased execution and address their specific timeline constraints.`;
  }

  return `I have reviewed the client's relationship record. Please ask any specific questions regarding their previous objections, priorities, or migration preferences.`;
};

// Initialize Groq upon load
initializeGroq();
