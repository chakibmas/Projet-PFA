import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layout/MainLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { RoleGate } from '@/features/auth/components/RoleGate';
import { HomeRedirect } from '@/shared/components/HomeRedirect';

// ── Auth ────────────────────────────────────────────────────────────────────
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';

// ── Dashboards (role-specific) ──────────────────────────────────────────────
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { ClubAdminDashboardPage } from '@/features/admin/pages/ClubAdminDashboardPage';
import { MemberDashboardPage } from '@/features/dashboard/pages/MemberDashboardPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

// ── Admin Plateforme ────────────────────────────────────────────────────────
import { ValidateClubsPage } from '@/features/admin/pages/ValidateClubsPage';
import { ManageUsersPage } from '@/features/admin/pages/ManageUsersPage';

// ── Admin Club ──────────────────────────────────────────────────────────────
import { ClubMembersPage } from '@/features/admin/pages/ClubMembersPage';
import { ClubStatsPage } from '@/features/admin/pages/ClubStatsPage';

// ── Clubs ───────────────────────────────────────────────────────────────────
import { ClubsListPage } from '@/features/clubs/pages/ClubsListPage';
import { ClubDetailsPage } from '@/features/clubs/pages/ClubDetailsPage';
import { ClubCreateEditPage } from '@/features/clubs/pages/ClubCreateEditPage';

// ── Memberships ─────────────────────────────────────────────────────────────
import { ApplyPage } from '@/features/memberships/pages/ApplyPage';
import { MyMembershipsPage } from '@/features/memberships/pages/MyMembershipsPage';
import { AdminMembershipsPage } from '@/features/memberships/pages/AdminMembershipsPage';

// ── Events ──────────────────────────────────────────────────────────────────
import { EventsListPage } from '@/features/events/pages/EventsListPage';
import { EventDetailsPage } from '@/features/events/pages/EventDetailsPage';
import { EventCreateEditPage } from '@/features/events/pages/EventCreateEditPage';
import { MyRegistrationsPage } from '@/features/events/pages/MyRegistrationsPage';

// ── Announcements, Documents ────────────────────────────────────────────────
import { AnnouncementsPage } from '@/features/announcements/pages/AnnouncementsPage';
import { DocumentsPage } from '@/features/documents/pages/DocumentsPage';

// ── Notifications ───────────────────────────────────────────────────────────
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';

// ── Chatbot admin ───────────────────────────────────────────────────────────
import { ChatbotAdminPage } from '@/features/chatbot/pages/ChatbotAdminPage';

// ── Club Requests ───────────────────────────────────────────────────────────
import { CreateClubRequestPage } from '@/features/club-requests/pages/CreateClubRequestPage';
import { ManageClubRequestsPage } from '@/features/club-requests/pages/ManageClubRequestsPage';

// ═══════════════════════════════════════════════════════════════════════════
//  Route helper: wraps in ProtectedRoute + RoleGate
// ═══════════════════════════════════════════════════════════════════════════
function Protected({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export const router = createBrowserRouter([
  // ── Standalone (no layout) ──────────────────────────────────────────────
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ── App shell ───────────────────────────────────────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomeRedirect /> },

      // ══ PUBLIC — accessible sans auth (Visiteur) ════════════════════════
      { path: 'clubs', element: <ClubsListPage /> },
      { path: 'clubs/:id', element: <ClubDetailsPage /> },
      { path: 'events', element: <EventsListPage /> },
      { path: 'events/:id', element: <EventDetailsPage /> },

      // ══ DASHBOARDS — role-specific ═══════════════════════════════════════
      {
        path: 'dashboard',
        element: <Protected><DashboardPage /></Protected>,
      },
      {
        path: 'admin/dashboard',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN']}>
              <AdminDashboardPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'club-admin/dashboard',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN']}>
              <ClubAdminDashboardPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'member/dashboard',
        element: (
          <Protected>
            <RoleGate roles={['MEMBER']}>
              <MemberDashboardPage />
            </RoleGate>
          </Protected>
        ),
      },

      // ══ ADMIN PLATEFORME ═════════════════════════════════════════════════
      {
        path: 'admin/validate-clubs',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN']}>
              <ValidateClubsPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN']}>
              <ManageUsersPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'admin/chatbot',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN']}>
              <ChatbotAdminPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'admin/club-requests',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN']}>
              <ManageClubRequestsPage />
            </RoleGate>
          </Protected>
        ),
      },

      // ══ CLUB REQUESTS (Membre) ═══════════════════════════════════════════
      {
        path: 'club-requests/new',
        element: (
          <Protected>
            <RoleGate roles={['MEMBER']}>
              <CreateClubRequestPage />
            </RoleGate>
          </Protected>
        ),
      },

      // ══ ADMIN CLUB ═══════════════════════════════════════════════════════
      {
        path: 'clubs/:clubId/members',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <ClubMembersPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'clubs/:clubId/stats',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <ClubStatsPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'clubs/new',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN', 'CLUB_ADMIN']}>
              <ClubCreateEditPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'clubs/:id/edit',
        element: (
          <Protected>
            <RoleGate roles={['PLATFORM_ADMIN', 'CLUB_ADMIN']}>
              <ClubCreateEditPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'clubs/:clubId/memberships',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <AdminMembershipsPage />
            </RoleGate>
          </Protected>
        ),
      },

      // ══ MEMBRE ═══════════════════════════════════════════════════════════
      {
        path: 'memberships',
        element: <Protected><MyMembershipsPage /></Protected>,
      },
      {
        path: 'memberships/apply/:clubId',
        element: <Protected><ApplyPage /></Protected>,
      },
      {
        path: 'my-registrations',
        element: (
          <Protected>
            <RoleGate roles={['MEMBER', 'CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <MyRegistrationsPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'notifications',
        element: <Protected><NotificationsPage /></Protected>,
      },

      // ══ SHARED AUTH (all authenticated roles) ════════════════════════════
      {
        path: 'profile',
        element: <Protected><ProfilePage /></Protected>,
      },
      {
        path: 'announcements',
        element: <Protected><AnnouncementsPage /></Protected>,
      },
      {
        path: 'documents',
        element: <Protected><DocumentsPage /></Protected>,
      },

      // Events — admin actions
      {
        path: 'events/new',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <EventCreateEditPage />
            </RoleGate>
          </Protected>
        ),
      },
      {
        path: 'events/:id/edit',
        element: (
          <Protected>
            <RoleGate roles={['CLUB_ADMIN', 'PLATFORM_ADMIN']}>
              <EventCreateEditPage />
            </RoleGate>
          </Protected>
        ),
      },

      // Fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
