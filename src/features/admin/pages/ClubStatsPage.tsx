import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { apiGet, getErrorMessage } from '@/shared/api/apiClient';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ErrorState } from '@/shared/components/ErrorState';
import { DashboardKPIs } from '@/shared/types/dashboard.types';

/* ── Stat Card ────────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: ReactNode;
  color: string;
  isLoading: boolean;
  suffix?: string;
  /** Optional 0-100 progress bar below the value */
  progress?: number;
}

function StatCard({ label, value, icon, color, isLoading, suffix, progress }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={progress != null ? 2 : 0}>
          <Box
            sx={{ bgcolor: color, borderRadius: 2, p: 1.5, display: 'flex', color: 'white' }}
            aria-hidden
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" display="block">
              {label}
            </Typography>
            {isLoading ? (
              <Skeleton width={80} height={44} />
            ) : (
              <Typography variant="h4" fontWeight={700}>
                {value != null
                  ? `${value.toLocaleString('fr-FR')}${suffix ?? ''}`
                  : '\u2014'}
              </Typography>
            )}
          </Box>
        </Box>

        {progress != null && !isLoading && (
          <Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
              }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {progress.toLocaleString('fr-FR')} %
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export function ClubStatsPage() {
  const { user } = useAuth();
  const clubId = user?.clubId;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['club-stats', clubId],
    queryFn: () => apiGet<DashboardKPIs>('/api/dashboard/kpis'),
    enabled: !!clubId,
  });

  if (isError) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3} component="h1">
          Statistiques du club
        </Typography>
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </Box>
    );
  }

  const stats: StatCardProps[] = [
    {
      label: 'Nombre de membres',
      value: data?.totalMembers,
      icon: <PeopleIcon fontSize="large" />,
      color: '#2E7D32',
      isLoading,
    },
    {
      label: '\u00c9v\u00e9nements organis\u00e9s',
      value: data?.totalEvents,
      icon: <EventIcon fontSize="large" />,
      color: '#6A1B9A',
      isLoading,
    },
    {
      label: 'Taux de participation',
      value: data?.tauxParticipation,
      icon: <TrendingUpIcon fontSize="large" />,
      color: '#00695C',
      isLoading,
      suffix: ' %',
      progress: data?.tauxParticipation,
    },
    {
      label: 'Documents d\u00e9pos\u00e9s',
      value: data?.totalRegistrations, // closest available KPI
      icon: <DescriptionIcon fontSize="large" />,
      color: '#1565C0',
      isLoading,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Statistiques du club
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
