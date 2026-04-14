export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatAskRequest {
  message: string;
  context?: string;
}

export interface ChatAskResponse {
  answer: string;
  suggestedActions?: SuggestedAction[];
  escalate?: boolean;
}

export interface SuggestedAction {
  label: string;
  value: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
}

export interface FAQFormData {
  question: string;
  answer: string;
  category?: string;
}

export interface ChatLog {
  id: string;
  userId?: string;
  sessionId: string;
  userMessage: string;
  botAnswer: string;
  escalated: boolean;
  feedback?: 'POSITIVE' | 'NEGATIVE';
  createdAt: string;
}
