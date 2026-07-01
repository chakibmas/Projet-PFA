import { apiGet, apiPost } from '@/shared/api/apiClient';
import { ClubRequest, CreateClubRequestData } from '@/shared/types/clubRequest.types';

export const clubRequestsApi = {
  /** Membre : soumettre une demande de création de club */
  create: (data: CreateClubRequestData) =>
    apiPost<ClubRequest>('/api/club-requests', data),

  /** Membre : voir mes demandes */
  getMyRequests: () =>
    apiGet<ClubRequest[]>('/api/club-requests/me'),

  /** Admin : voir toutes les demandes en attente */
  getAll: () =>
    apiGet<ClubRequest[]>('/api/club-requests'),

  /** Admin : approuver une demande → crée le club + promeut le membre en CLUB_ADMIN */
  approve: (requestId: string, comment?: string) =>
    apiPost<ClubRequest>(`/api/club-requests/${requestId}/approve`, { comment }),

  /** Admin : refuser une demande */
  reject: (requestId: string, comment?: string) =>
    apiPost<ClubRequest>(`/api/club-requests/${requestId}/reject`, { comment }),
};
