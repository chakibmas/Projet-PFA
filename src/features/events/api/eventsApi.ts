import { apiGet, apiPost, apiPut } from '@/shared/api/apiClient';
import { Event, EventFormData, CheckInRequest } from '@/shared/types/event.types';
import { PagedResponse } from '@/shared/types/club.types';

export const eventsApi = {
  list: (params?: { clubId?: string; page?: number; size?: number }) =>
    apiGet<PagedResponse<Event>>('/api/events', params as Record<string, unknown>),

  getById: (id: string) => apiGet<Event>(`/api/events/${id}`),

  create: (data: EventFormData) => apiPost<Event>('/api/events', data),

  update: (id: string, data: EventFormData) => apiPut<Event>(`/api/events/${id}`, data),

  register: (id: string) => apiPost<void>(`/api/events/${id}/register`),

  checkIn: (id: string, data: CheckInRequest) =>
    apiPost<void>(`/api/events/${id}/checkin`, data),
};
