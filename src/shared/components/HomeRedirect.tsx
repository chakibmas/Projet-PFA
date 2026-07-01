import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Redirects to the appropriate dashboard based on the user's active role.
 * Supports multi-role users via activeRole from auth store.
 */
export function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!isAuthenticated || !user) {
    return <Navigate to="/clubs" replace />;
  }

  const role = activeRole ?? user.role;
  switch (role) {
    case 'PLATFORM_ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'CLUB_ADMIN':
      return <Navigate to="/club-admin/dashboard" replace />;
    case 'MEMBER':
      return <Navigate to="/member/dashboard" replace />;
    default:
      return <Navigate to="/clubs" replace />;
  }
}
