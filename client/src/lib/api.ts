import axios from 'axios';
import {
  Client,
  Interaction,
  ChatResponse,
  MeetingBriefResponse,
  ClientMemory,
  SeedResult,
  ChatMessage
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const fetchClient = async (id: string): Promise<Client> => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const fetchInteractions = async (clientId: string): Promise<Interaction[]> => {
  const response = await api.get(`/clients/${clientId}/interactions`);
  return response.data;
};

export const addInteraction = async (
  clientId: string,
  interaction: {
    title: string;
    content: string;
    type: Interaction['type'];
    date?: string;
  }
): Promise<Interaction> => {
  const response = await api.post(`/clients/${clientId}/interactions`, interaction);
  return response.data;
};

export const chatWithClient = async (
  clientId: string,
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> => {
  const response = await api.post(`/clients/${clientId}/chat`, { message, history });
  return response.data;
};

export const generateMeetingBrief = async (
  clientId: string
): Promise<MeetingBriefResponse> => {
  const response = await api.post(`/clients/${clientId}/meeting-brief`);
  return response.data;
};

export const fetchClientMemory = async (
  clientId: string
): Promise<ClientMemory> => {
  const response = await api.get(`/clients/${clientId}/memory`);
  return response.data;
};

export const submitFeedback = async (
  clientId: string,
  feedback: string,
  helpful: boolean,
  interactionId?: string,
  context?: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/clients/${clientId}/feedback`, {
    feedback,
    helpful,
    interactionId,
    context
  });
  return response.data;
};

export const triggerSeed = async (force = false): Promise<SeedResult> => {
  const response = await api.post('/seed', { force });
  return response.data;
};

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};
