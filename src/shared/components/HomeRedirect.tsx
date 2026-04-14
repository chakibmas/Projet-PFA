import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Redirects to the appropriate dashboard based on the user's role.
 * VISITOR → /clubs (public)
 */
export function HomeRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthenticated || !user) {
    return <Navigate to="/clubs" replace />;
  }

  switch (user.role) {
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
