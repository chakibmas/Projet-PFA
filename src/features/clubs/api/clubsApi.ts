import { apiGet, apiPost, apiPut } from '@/shared/api/apiClient';
import { Club, ClubFormData, PagedResponse } from '@/shared/types/club.types';

export const clubsApi = {
  list: (params?: { search?: string; page?: number; size?: number }) =>
    apiGet<PagedResponse<Club>>('/api/clubs', params as Record<string, unknown>),

  getById: (id: string) => apiGet<Club>(`/api/clubs/${id}`),

  create: (data: ClubFormData) => apiPost<Club>('/api/clubs', data),

  update: (id: string, data: ClubFormData) => apiPut<Club>(`/api/clubs/${id}`, data),
};
