import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

// ── Minimal stubs ────────────────────────────────────────────────────────────
const mockAuthStore = {
  user: { id: '1', email: 'admin@test.com', firstName: 'Admin', lastName: 'Test', role: 'PLATFORM_ADMIN' as const, createdAt: '' },
  isAuthenticated: true,
  accessToken: 'token',
  hasRole: () => true,
  setAuth: vi.fn(),
  logout: vi.fn(),
};

vi.mock('@/features/auth/store/authStore', () => ({
  useAuthStore: vi.fn((selector?: (s: typeof mockAuthStore) => unknown) =>
    selector ? selector(mockAuthStore) : mockAuthStore,
  ),
}));

vi.mock('@/app/providers/SnackbarContext', () => ({
  useSnackbar: () => vi.fn(),
  SnackbarProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme()}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('DashboardPage – smoke test', () => {
  it('renders the page title', () => {
    render(
      <Wrapper>
        <DashboardPage />
      </Wrapper>,
    );
    expect(screen.getByRole('heading', { name: /tableau de bord/i })).toBeInTheDocument();
  });
});

describe('LoginPage – smoke test', () => {
  it('renders email and password fields', async () => {
    const { LoginPage } = await import('@/features/auth/pages/LoginPage');
    render(
      <Wrapper>
        <LoginPage />
      </Wrapper>,
    );
    expect(screen.getByLabelText(/adresse e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });
});

describe('ClubsListPage – smoke test', () => {
  it('renders the clubs heading', async () => {
    const { ClubsListPage } = await import('@/features/clubs/pages/ClubsListPage');
    render(
      <Wrapper>
        <ClubsListPage />
      </Wrapper>,
    );
    expect(screen.getByRole('heading', { name: /clubs/i })).toBeInTheDocument();
  });
});
