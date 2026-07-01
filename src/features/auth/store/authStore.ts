import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/shared/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;        // the currently active role (for multi-role users)
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;  // check if user has ANY of these roles (across all roles)
  switchRole: (role: UserRole) => void;
  getEffectiveRoles: () => UserRole[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      activeRole: null,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        // Determine effective roles: use `roles` array if provided, else fallback to single `role`
        const effectiveRoles = user.roles && user.roles.length > 0 ? user.roles : [user.role];
        // Default active role: prioritize the primary role
        const activeRole = effectiveRoles.includes(user.role) ? user.role : effectiveRoles[0];
        set({ user, accessToken, isAuthenticated: true, activeRole });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, isAuthenticated: false, activeRole: null });
      },

      hasRole: (roles) => {
        const { activeRole } = get();
        return activeRole ? roles.includes(activeRole) : false;
      },

      hasAnyRole: (roles) => {
        const effectiveRoles = get().getEffectiveRoles();
        return effectiveRoles.some((r) => roles.includes(r));
      },

      switchRole: (role) => {
        const effectiveRoles = get().getEffectiveRoles();
        if (effectiveRoles.includes(role)) {
          set({ activeRole: role });
        }
      },

      getEffectiveRoles: () => {
        const { user } = get();
        if (!user) return [];
        return user.roles && user.roles.length > 0 ? user.roles : [user.role];
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
    },
  ),
);
