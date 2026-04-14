import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventIcon from '@mui/icons-material/Event';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { ErrorState } from '@/shared/components/ErrorState';
import { getErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: number | undefined;
  icon: ReactNode;
  color: string;
  isLoading: boolean;
}

function KPICard({ label, value, icon, color, isLoading }: KPICardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ bgcolor: color, borderRadius: 2, p: 1.5, display: 'flex', color: 'white' }} aria-hidden>
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
                {value?.toLocaleString('fr-FR') ?? '—'}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => dashboardApi.getKPIs(),
  });

  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  // ── PLATFORM_ADMIN KPIs ─────────────────────────────────────────────────
  const platformKpis = [
    { label: 'Clubs actifs',         value: data?.activeClubs,        icon: <GroupsIcon />,         color: '#1565C0' },
    { label: 'Total membres',         value: data?.totalMembers,        icon: <PeopleIcon />,         color: '#2E7D32' },
    { label: 'Adhésions en attente',  value: data?.pendingMemberships,  icon: <PendingActionsIcon />, color: '#E65100' },
    { label: 'Événements à venir',    value: data?.upcomingEvents,      icon: <EventIcon />,          color: '#6A1B9A' },
    { label: 'Total inscriptions',    value: data?.totalRegistrations,  icon: <HowToRegIcon />,       color: '#00695C' },
    { label: 'Total clubs',           value: data?.totalClubs,          icon: <GroupsIcon />,         color: '#0277BD' },
  ];

  // ── CLUB_ADMIN KPIs ─────────────────────────────────────────────────────
  const clubAdminKpis = [
    { label: 'Membres du club',      value: 142,  icon: <PeopleIcon />,         color: '#2E7D32' },
    { label: 'Adhésions en attente', value: data?.pendingMemberships, icon: <PendingActionsIcon />, color: '#E65100' },
    { label: 'Événements à venir',   value: data?.upcomingEvents,     icon: <EventIcon />,          color: '#6A1B9A' },
    { label: 'Total inscriptions',   value: data?.totalRegistrations, icon: <HowToRegIcon />,       color: '#00695C' },
  ];

  // ── MEMBER KPIs ─────────────────────────────────────────────────────────
  const memberKpis = [
    { label: 'Clubs rejoints',       value: 1,  icon: <GroupsIcon />, color: '#1565C0' },
    { label: 'Événements inscrits',  value: 2,  icon: <EventIcon />,  color: '#6A1B9A' },
    { label: 'Demandes en attente',  value: 1,  icon: <PendingActionsIcon />, color: '#E65100' },
  ];

  const kpis =
    user?.role === 'PLATFORM_ADMIN' ? platformKpis
    : user?.role === 'CLUB_ADMIN'   ? clubAdminKpis
    : memberKpis;

  const greeting = user
    ? `Bonjour, ${user.firstName} 👋`
    : 'Tableau de bord';

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} component="h1">
            {greeting}
          </Typography>
          <Chip
            label={
              user?.role === 'PLATFORM_ADMIN' ? 'Administrateur de la plateforme'
              : user?.role === 'CLUB_ADMIN'   ? `Administrateur – ${user.clubId ? 'Club Informatique & IA' : 'votre club'}`
              : 'Espace membre'
            }
            size="small"
            sx={{ mt: 0.5, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
          />
        </Box>

        {/* Quick actions per role */}
        <Stack direction="row" gap={1} flexWrap="wrap">
          {user?.role === 'PLATFORM_ADMIN' && (
            <>
              <Button variant="outlined" size="small" startIcon={<AddCircleIcon />} onClick={() => navigate('/clubs/new')}>
                Nouveau club
              </Button>
              <Button variant="contained" size="small" startIcon={<AddCircleIcon />} onClick={() => navigate('/events/new')}>
                Nouvel événement
              </Button>
            </>
          )}
          {user?.role === 'CLUB_ADMIN' && user.clubId && (
            <>
              <Button variant="outlined" size="small" startIcon={<PendingActionsIcon />} onClick={() => navigate(`/clubs/${user.clubId}/memberships`)}>
                Valider adhésions
              </Button>
              <Button variant="contained" size="small" startIcon={<AddCircleIcon />} onClick={() => navigate('/events/new')}>
                Nouvel événement
              </Button>
            </>
          )}
          {user?.role === 'MEMBER' && (
            <>
              <Button variant="outlined" size="small" startIcon={<GroupsIcon />} onClick={() => navigate('/clubs')}>
                Rejoindre un club
              </Button>
              <Button variant="contained" size="small" startIcon={<EventIcon />} onClick={() => navigate('/events')}>
                Voir les événements
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={4} key={kpi.label}>
            <KPICard {...kpi} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
