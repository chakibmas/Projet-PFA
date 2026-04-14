import { apiGet, apiPost } from '@/shared/api/apiClient';
import { ChatAskRequest, ChatAskResponse, FAQ, FAQFormData, ChatLog } from '@/shared/types/chatbot.types';

export const chatbotApi = {
  ask: (data: ChatAskRequest) => apiPost<ChatAskResponse>('/api/chatbot/ask', data),

  getFAQs: () => apiGet<FAQ[]>('/api/chatbot/faqs'),

  createFAQ: (data: FAQFormData) => apiPost<FAQ>('/api/chatbot/faqs', data),

  getLogs: () => apiGet<ChatLog[]>('/api/chatbot/logs'),
};
