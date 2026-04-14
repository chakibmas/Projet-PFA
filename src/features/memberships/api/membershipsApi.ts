import { apiGet, apiPost } from '@/shared/api/apiClient';
import { Membership, MembershipApplyRequest } from '@/shared/types/membership.types';
import { PagedResponse } from '@/shared/types/club.types';

export const membershipsApi = {
  apply: (data: MembershipApplyRequest) =>
    apiPost<Membership>('/api/memberships/apply', data),

  getMine: () => apiGet<Membership[]>('/api/memberships/me'),

  getClubMemberships: (clubId: string, status?: string) =>
    apiGet<PagedResponse<Membership>>(`/api/clubs/${clubId}/memberships`, status ? { status } : undefined),

  approve: (id: string) => apiPost<Membership>(`/api/memberships/${id}/approve`),

  reject: (id: string) => apiPost<Membership>(`/api/memberships/${id}/reject`),
};
