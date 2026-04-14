import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { UpdateProfileRequest, ChangePasswordRequest } from '@/shared/types/auth.types';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';

export function useUpdateProfile() {
  const qc = useQueryClient();
  const notify = useSnackbar();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate auth queries
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      // Update user store if needed (handled by auth hook)
      notify(`Profil mis à jour !`, 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}

export function useChangePassword() {
  const notify = useSnackbar();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      notify('Mot de passe changé avec succès !', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  const notify = useSnackbar();

  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      notify('Photo de profil mise à jour !', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}

export function useGetSessions() {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => authApi.getSessions(),
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  const notify = useSnackbar();

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'sessions'] });
      notify('Session révoquée', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });
}
