import { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiGet, getErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorState } from '@/shared/components/ErrorState';
import { Membership } from '@/shared/types/membership.types';
import { Event } from '@/shared/types/event.types';
import { Announcement } from '@/shared/types/announcement.types';

/* ── Stat card ─────────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: ReactNode;
  color: string;
  to: string;
  isLoading: boolean;
}

function StatCard({ label, value, icon, color, to, isLoading }: StatCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(to)}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{ bgcolor: color, borderRadius: 2, p: 1.5, display: 'flex', color: 'white' }}
              aria-hidden
            >
              {icon}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {label}
              </Typography>
              {isLoading ? (
                <Skeleton width={60} height={36} />
              ) : (
                <Typography variant="h5" fontWeight={700}>
                  {value?.toLocaleString('fr-FR') ?? '0'}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export function MemberDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Queries ──────────────────────────────────────────────────────────────
  const membershipsQuery = useQuery({
    queryKey: ['memberships', 'me'],
    queryFn: () => apiGet<Membership[]>('/api/memberships/me'),
  });

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => apiGet<{ content: Event[] }>('/api/events'),
  });

  const announcementsQuery = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiGet<Announcement[]>('/api/announcements'),
  });

  const isLoading =
    membershipsQuery.isLoading || eventsQuery.isLoading || announcementsQuery.isLoading;

  const isError =
    membershipsQuery.isError || eventsQuery.isError || announcementsQuery.isError;

  const errorMsg =
    membershipsQuery.error
      ? getErrorMessage(membershipsQuery.error)
      : eventsQuery.error
        ? getErrorMessage(eventsQuery.error)
        : announcementsQuery.error
          ? getErrorMessage(announcementsQuery.error)
          : '';

  const refetchAll = () => {
    membershipsQuery.refetch();
    eventsQuery.refetch();
    announcementsQuery.refetch();
  };

  if (isError) return <ErrorState message={errorMsg} onRetry={refetchAll} />;

  // ── Derived counts ──────────────────────────────────────────────────────
  const memberships = membershipsQuery.data ?? [];
  const events = eventsQuery.data?.content ?? [];
  const announcements = announcementsQuery.data ?? [];

  const clubsJoined = memberships.filter((m) => m.status === 'APPROUVEE').length;
  const pendingRequests = memberships.filter((m) => m.status === 'EN_ATTENTE').length;
  const registeredEvents = events.length;
  const unreadAnnouncements = announcements.filter((a) => a.isRead === false).length;

  // Upcoming events: sorted by startDate, first 3
  const upcomingEvents = [...events]
    .filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  // ── Stat cards config ───────────────────────────────────────────────────
  const stats: Omit<StatCardProps, 'isLoading'>[] = [
    { label: 'Mes clubs', value: clubsJoined, icon: <GroupsIcon />, color: '#1565C0', to: '/memberships' },
    { label: 'Evenements inscrits', value: registeredEvents, icon: <EventIcon />, color: '#6A1B9A', to: '/events' },
    { label: 'Demandes en attente', value: pendingRequests, icon: <PendingActionsIcon />, color: '#E65100', to: '/memberships' },
    { label: 'Annonces non lues', value: unreadAnnouncements, icon: <CampaignIcon />, color: '#00695C', to: '/announcements' },
  ];

  return (
    <Box>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Mon espace membre
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mt={0.5}>
          Bonjour, {user?.firstName ?? 'membre'} {'\uD83D\uDC4B'}
        </Typography>
      </Box>

      {/* ── Stats cards ─────────────────────────────────────────────────────── */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <StatCard {...s} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>

      {/* ── Actions rapides ─────────────────────────────────────────────────── */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Actions rapides
      </Typography>
      <Stack direction="row" gap={2} flexWrap="wrap" mb={4}>
        <Button variant="outlined" startIcon={<GroupsIcon />} onClick={() => navigate('/clubs')}>
          Rejoindre un club
        </Button>
        <Button variant="outlined" startIcon={<EventIcon />} onClick={() => navigate('/events')}>
          Voir les evenements
        </Button>
        <Button variant="outlined" startIcon={<PendingActionsIcon />} onClick={() => navigate('/memberships')}>
          Mes adhesions
        </Button>
      </Stack>

      {/* ── Prochains evenements ────────────────────────────────────────────── */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Prochains evenements
      </Typography>

      {isLoading && <Skeleton variant="rounded" height={120} />}

      {!isLoading && upcomingEvents.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Aucun evenement a venir.
        </Typography>
      )}

      {!isLoading && upcomingEvents.length > 0 && (
        <Stack spacing={2}>
          {upcomingEvents.map((ev) => (
            <Card key={ev.id} variant="outlined">
              <CardActionArea onClick={() => navigate(`/events/${ev.id}`)}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {ev.title}
                  </Typography>
                  <Stack direction="row" gap={3} mt={0.5} flexWrap="wrap">
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(ev.startDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <PlaceIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {ev.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
