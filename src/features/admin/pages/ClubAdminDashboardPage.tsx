import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CampaignIcon from '@mui/icons-material/Campaign';
import FolderIcon from '@mui/icons-material/Folder';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { apiGet, getErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorState } from '@/shared/components/ErrorState';
import { DashboardKPIs } from '@/shared/types/dashboard.types';

/* ── KPI Card ─────────────────────────────────────────────────────────────── */

interface KPICardProps {
  label: string;
  value: number | undefined;
  icon: ReactNode;
  color: string;
  isLoading: boolean;
  suffix?: string;
}

function KPICard({ label, value, icon, color, isLoading, suffix }: KPICardProps) {
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
                {value != null
                  ? `${value.toLocaleString('fr-FR')}${suffix ?? ''}`
                  : '\u2014'}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

/* ── Quick Action Card ────────────────────────────────────────────────────── */

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  onClick: () => void;
}

function QuickActionCard({ label, icon, color, onClick }: QuickActionProps) {
  return (
    <Card
      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}
      onClick={onClick}
    >
      <CardContent>
        <Stack alignItems="center" spacing={1} py={1}>
          <Box sx={{ color: `${color}.main` }}>{icon}</Box>
          <Typography variant="body2" fontWeight={600} textAlign="center">
            {label}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export function ClubAdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const clubId = user?.clubId;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', 'club-admin', clubId],
    queryFn: () => apiGet<DashboardKPIs>('/api/dashboard/kpis'),
    enabled: !!clubId,
  });

  /* No club assigned */
  if (!clubId) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3} component="h1">
          Tableau de bord &ndash; Mon club
        </Typography>
        <Alert severity="info">Aucun club assign&eacute;</Alert>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3} component="h1">
          Tableau de bord &ndash; Mon club
        </Typography>
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </Box>
    );
  }

  const kpis = [
    {
      label: 'Membres du club',
      value: data?.totalMembers,
      icon: <PeopleIcon />,
      color: '#2E7D32',
    },
    {
      label: 'Adh\u00e9sions en attente',
      value: data?.pendingMemberships,
      icon: <PendingActionsIcon />,
      color: '#E65100',
    },
    {
      label: '\u00c9v\u00e9nements \u00e0 venir',
      value: data?.upcomingEvents,
      icon: <EventIcon />,
      color: '#6A1B9A',
    },
    {
      label: 'Taux de participation',
      value: data?.tauxParticipation,
      icon: <TrendingUpIcon />,
      color: '#00695C',
      suffix: ' %',
    },
  ];

  const quickActions: QuickActionProps[] = [
    {
      label: 'Valider les adh\u00e9sions',
      icon: <CheckCircleIcon fontSize="large" />,
      color: 'warning',
      onClick: () => navigate(`/clubs/${clubId}/memberships`),
    },
    {
      label: 'Cr\u00e9er un \u00e9v\u00e9nement',
      icon: <AddCircleIcon fontSize="large" />,
      color: 'primary',
      onClick: () => navigate('/events/new'),
    },
    {
      label: 'Publier une annonce',
      icon: <CampaignIcon fontSize="large" />,
      color: 'info',
      onClick: () => navigate('/announcements'),
    },
    {
      label: 'G\u00e9rer les documents',
      icon: <FolderIcon fontSize="large" />,
      color: 'secondary',
      onClick: () => navigate('/documents'),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Tableau de bord &ndash; Mon club
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <KPICard {...kpi} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        Actions rapides
      </Typography>
      <Grid container spacing={2}>
        {quickActions.map((action) => (
          <Grid item xs={6} sm={3} key={action.label}>
            <QuickActionCard {...action} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
