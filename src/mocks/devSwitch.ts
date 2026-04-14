import { User } from '@/shared/types/auth.types';

export interface DevPersona {
  id: string;
  name: string;
  email?: string;
  role: User['role'];
  user?: User;
}

export const DEV_PERSONAS: DevPersona[] = [
  {
    id: 'platform-admin',
    name: 'Ahmed B.',
    email: 'admin@uniclubs.fr',
    role: 'PLATFORM_ADMIN',
    user: {
      id: 'u1',
      email: 'admin@uniclubs.fr',
      firstName: 'Ahmed',
      lastName: 'Benali',
      role: 'PLATFORM_ADMIN',
      createdAt: '2024-09-01T08:00:00Z',
    },
  },
  {
    id: 'club-admin',
    name: 'Omar I.',
    email: 'omar@uniclubs.fr',
    role: 'CLUB_ADMIN',
    user: {
      id: 'u2',
      email: 'omar@uniclubs.fr',
      firstName: 'Omar',
      lastName: 'Idrissi',
      role: 'CLUB_ADMIN',
      clubId: 'c1',
      createdAt: '2024-09-01T08:00:00Z',
    },
  },
  {
    id: 'member',
    name: 'Sara M.',
    email: 'sara@etu.fr',
    role: 'MEMBER',
    user: {
      id: 'u10',
      email: 'sara@etu.fr',
      firstName: 'Sara',
      lastName: 'Moukrim',
      role: 'MEMBER',
      createdAt: '2024-10-01T08:00:00Z',
    },
  },
  {
    id: 'visitor',
    name: 'Visiteur',
    role: 'VISITOR',
  },
];

/** Switch to the persona and reload the page. */
export function switchDevPersona(personaId: string) {
  const persona = DEV_PERSONAS.find((p) => p.id === personaId);
  if (!persona) return;

  if (persona.role === 'VISITOR' || !persona.user) {
    // Clear auth → visitor mode
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth-store');
  } else {
    const token = `mock-token-${persona.id}`;
    localStorage.setItem('access_token', token);
    localStorage.setItem(
      'auth-store',
      JSON.stringify({
        state: {
          user: persona.user,
          accessToken: token,
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  }

  // Redirect to role-specific dashboard
  const dashboards: Record<string, string> = {
    PLATFORM_ADMIN: '/admin/dashboard',
    CLUB_ADMIN: '/club-admin/dashboard',
    MEMBER: '/member/dashboard',
    VISITOR: '/clubs',
  };
  window.location.href = dashboards[persona.role] ?? '/clubs';
}
