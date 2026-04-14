import { apiGet, apiPost, apiPut, apiUpload } from '@/shared/api/apiClient';
import { User, Session, UpdateProfileRequest, ChangePasswordRequest } from '@/shared/types/auth.types';

export const authApi = {
  updateProfile: (data: UpdateProfileRequest) =>
    apiPut<User>('/api/auth/profile', data),

  changePassword: (data: ChangePasswordRequest) =>
    apiPost<{ message: string }>('/api/auth/change-password', data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiUpload<User>('/api/auth/avatar', form);
  },

  getSessions: () => apiGet<Session[]>('/api/auth/sessions'),

  revokeSession: (sessionId: string) =>
    apiPost<void>(`/api/auth/sessions/${sessionId}/revoke`),
};
