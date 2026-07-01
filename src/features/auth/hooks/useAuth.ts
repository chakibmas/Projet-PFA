import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost, getErrorMessage } from '@/shared/api/apiClient';
import { LoginRequest, LoginResponse, User } from '@/shared/types/auth.types';
import { useAuthStore } from '../store/authStore';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const store = useAuthStore();
  const notify = useSnackbar();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) =>
      apiPost<LoginResponse>('/api/auth/login', data),
    onSuccess: ({ user, accessToken, refreshToken }) => {
      store.setAuth(user, accessToken, refreshToken);
      notify('Connexion réussie !', 'success');
      // Redirect to role-specific dashboard (primary role)
      const dashboards: Record<string, string> = {
        PLATFORM_ADMIN: '/admin/dashboard',
        CLUB_ADMIN: '/club-admin/dashboard',
        MEMBER: '/member/dashboard',
      };
      navigate(dashboards[user.role] ?? '/clubs', { replace: true });
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const { data: me } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiGet<User>('/api/auth/me'),
    enabled: store.isAuthenticated,
    staleTime: Infinity,
  });

  const logout = () => {
    store.logout();
    navigate('/login', { replace: true });
  };

  return {
    user: me ?? store.user,
    isAuthenticated: store.isAuthenticated,
    activeRole: store.activeRole,
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,
    switchRole: store.switchRole,
    getEffectiveRoles: store.getEffectiveRoles,
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    logout,
  };
}
