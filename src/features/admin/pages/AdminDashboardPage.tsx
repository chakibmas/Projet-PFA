import { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/features/dashboard/api/dashboardApi';
import { ErrorState } from '@/shared/components/ErrorState';
import { getErrorMessage } from '@/shared/api/apiClient';

// ── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: number | string | undefined;
  icon: ReactNode;
  color: string;
  isLoading: boolean;
}

function KPICard({ label, value, icon, color, isLoading }: KPICardProps) {
  return (
    <Card>
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
                {typeof value === 'number' ? value.toLocaleString('fr-FR') : (value ?? '—')}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'dashboard', 'kpis'],
    queryFn: () => dashboardApi.getKPIs(),
  });

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const kpis: KPICardProps[] = [
    { label: 'Total clubs',           value: data?.totalClubs,          icon: <GroupsIcon />,          color: '#0277BD', isLoading },
    { label: 'Clubs actifs',          value: data?.activeClubs,         icon: <CheckCircleIcon />,     color: '#2E7D32', isLoading },
    { label: 'Clubs en attente',      value: data?.pendingClubs,        icon: <HourglassTopIcon />,    color: '#E65100', isLoading },
    { label: 'Total membres',         value: data?.totalMembers,        icon: <PeopleIcon />,          color: '#1565C0', isLoading },
    { label: 'Adhésions en attente',  value: data?.pendingMemberships,  icon: <PendingActionsIcon />,  color: '#F57F17', isLoading },
    { label: 'Événements',            value: data?.totalEvents,         icon: <EventIcon />,           color: '#6A1B9A', isLoading },
    {
      label: 'Taux de participation',
      value: data?.tauxParticipation != null ? `${data.tauxParticipation} %` : undefined,
      icon: <TrendingUpIcon />,
      color: '#00695C',
      isLoading,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        mb={3}
        gap={2}
      >
        <Typography variant="h5" fontWeight={700} component="h1">
          Administration de la plateforme
        </Typography>

        {/* Quick actions */}
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            size="small"
            startIcon={<VerifiedUserIcon />}
            onClick={() => navigate('/admin/validate-clubs')}
          >
            Valider clubs en attente
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ManageAccountsIcon />}
            onClick={() => navigate('/admin/users')}
          >
            Gérer les utilisateurs
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SmartToyIcon />}
            onClick={() => navigate('/admin/chatbot')}
          >
            Modérer chatbot
          </Button>
        </Stack>
      </Stack>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={kpi.label}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
