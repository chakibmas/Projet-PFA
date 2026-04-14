import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiGet, getErrorMessage } from '@/shared/api/apiClient';
import { InscriptionEvenement, StatutInscription } from '@/shared/types/event.types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const statutConfig: Record<StatutInscription, { label: string; color: 'success' | 'warning' | 'error' }> = {
  CONFIRMEE: { label: 'Confirmee', color: 'success' },
  EN_ATTENTE: { label: 'En attente', color: 'warning' },
  ANNULEE: { label: 'Annulee', color: 'error' },
};

/* ── Page ───────────────────────────────────────────────────────────────────── */

export function MyRegistrationsPage() {
  const navigate = useNavigate();

  const { data: registrations, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', 'my-registrations'],
    queryFn: () => apiGet<InscriptionEvenement[]>('/api/events/my-registrations'),
  });

  return (
    <Box>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Typography variant="h5" fontWeight={700} component="h1" mb={3}>
        Mes inscriptions
      </Typography>

      {/* ── States ──────────────────────────────────────────────────────────── */}
      {isLoading && <LoadingSkeleton rows={4} height={160} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {!isLoading && !isError && registrations?.length === 0 && (
        <EmptyState
          title="Aucune inscription"
          description="Vous n'etes inscrit a aucun evenement pour le moment."
          action={{ label: 'Parcourir les evenements', onClick: () => navigate('/events') }}
        />
      )}

      {/* ── Cards ───────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && registrations && registrations.length > 0 && (
        <Grid container spacing={3}>
          {registrations.map((reg) => {
            const cfg = statutConfig[reg.statut];
            return (
              <Grid item xs={12} sm={6} md={4} key={reg.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {reg.eventTitle}
                      </Typography>
                      <Chip label={cfg.label} color={cfg.color} size="small" />
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(reg.dateInscription).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Box px={2} pb={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/events/${reg.eventId}`)}
                    >
                      Voir le detail
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
