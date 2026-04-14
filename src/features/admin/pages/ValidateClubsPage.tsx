import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, getErrorMessage } from '@/shared/api/apiClient';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import type { Club, StatutClub } from '@/shared/types/club.types';

// ── Statut chip color mapping ────────────────────────────────────────────────

const statutColor: Record<StatutClub, 'warning' | 'success' | 'error' | 'default'> = {
  EN_ATTENTE: 'warning',
  VALIDE: 'success',
  SUSPENDU: 'error',
  ARCHIVE: 'default',
};

const statutLabel: Record<StatutClub, string> = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  SUSPENDU: 'Suspendu',
  ARCHIVE: 'Archivé',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export function ValidateClubsPage() {
  const notify = useSnackbar();
  const queryClient = useQueryClient();
  const [actionInFlight, setActionInFlight] = useState<string | null>(null);

  // Fetch all clubs (API may not support ?statut filter, so we fetch all)
  const { data: clubs, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'clubs'],
    queryFn: () => apiGet<Club[]>('/api/clubs'),
  });

  // ── Validate mutation ────────────────────────────────────────────────────
  const validateMutation = useMutation({
    mutationFn: (clubId: string) => apiPost(`/api/clubs/${clubId}/validate`),
    onSuccess: () => {
      notify('Club validé avec succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'clubs'] });
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
    onSettled: () => setActionInFlight(null),
  });

  // ── Suspend mutation ─────────────────────────────────────────────────────
  const suspendMutation = useMutation({
    mutationFn: (clubId: string) => apiPost(`/api/clubs/${clubId}/suspend`),
    onSuccess: () => {
      notify('Club suspendu', 'warning');
      queryClient.invalidateQueries({ queryKey: ['admin', 'clubs'] });
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
    onSettled: () => setActionInFlight(null),
  });

  const handleValidate = (id: string) => {
    setActionInFlight(id);
    validateMutation.mutate(id);
  };

  const handleSuspend = (id: string) => {
    setActionInFlight(id);
    suspendMutation.mutate(id);
  };

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} component="h1" mb={3}>
        Validation des clubs
      </Typography>

      {isLoading && (
        <Stack gap={1}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={52} />
          ))}
        </Stack>
      )}

      {!isLoading && clubs?.length === 0 && (
        <EmptyState title="Aucun club" description="Aucun club n'a encore été créé." />
      )}

      {!isLoading && clubs && clubs.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Catégorie</strong></TableCell>
                <TableCell><strong>Admin</strong></TableCell>
                <TableCell><strong>Date création</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubs.map((club) => (
                <TableRow key={club.id}>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.category}</TableCell>
                  <TableCell>{club.adminName ?? '—'}</TableCell>
                  <TableCell>{formatDate(club.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statutLabel[club.statut]}
                      color={statutColor[club.statut]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={1} justifyContent="flex-end">
                      {club.statut === 'EN_ATTENTE' && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          disabled={actionInFlight === club.id}
                          onClick={() => handleValidate(club.id)}
                        >
                          Valider
                        </Button>
                      )}
                      {(club.statut === 'EN_ATTENTE' || club.statut === 'VALIDE') && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<BlockIcon />}
                          disabled={actionInFlight === club.id}
                          onClick={() => handleSuspend(club.id)}
                        >
                          Suspendre
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
