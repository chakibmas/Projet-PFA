import { useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { clubRequestsApi } from '../api/clubRequestsApi';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import type { ClubRequest, ClubRequestStatus } from '@/shared/types/clubRequest.types';

const statusColor: Record<ClubRequestStatus, 'warning' | 'success' | 'error'> = {
  EN_ATTENTE: 'warning', APPROUVEE: 'success', REFUSEE: 'error',
};
const statusLabel: Record<ClubRequestStatus, string> = {
  EN_ATTENTE: 'En attente', APPROUVEE: 'Approuvée', REFUSEE: 'Refusée',
};

export function ManageClubRequestsPage() {
  const notify = useSnackbar();
  const queryClient = useQueryClient();
  const [actionTarget, setActionTarget] = useState<{ request: ClubRequest; action: 'approve' | 'reject' } | null>(null);
  const [comment, setComment] = useState('');

  const { data: requests, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['club-requests'],
    queryFn: () => clubRequestsApi.getAll(),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      clubRequestsApi.approve(id, comment),
    onSuccess: () => {
      notify('Demande approuvée ! Le club a été créé et le membre est devenu Admin Club.', 'success');
      queryClient.invalidateQueries({ queryKey: ['club-requests'] });
      setActionTarget(null);
      setComment('');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      clubRequestsApi.reject(id, comment),
    onSuccess: () => {
      notify('Demande refusée.', 'warning');
      queryClient.invalidateQueries({ queryKey: ['club-requests'] });
      setActionTarget(null);
      setComment('');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const handleConfirm = () => {
    if (!actionTarget) return;
    const { request, action } = actionTarget;
    if (action === 'approve') {
      approveMutation.mutate({ id: request.id, comment: comment || undefined });
    } else {
      rejectMutation.mutate({ id: request.id, comment: comment || undefined });
    }
  };

  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  const pendingRequests = requests?.filter((r) => r.status === 'EN_ATTENTE') ?? [];
  const processedRequests = requests?.filter((r) => r.status !== 'EN_ATTENTE') ?? [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} component="h1" mb={3}>
        Demandes de création de clubs
      </Typography>

      {isLoading && (
        <Stack gap={1}>{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={52} />)}</Stack>
      )}

      {!isLoading && pendingRequests.length === 0 && (
        <EmptyState title="Aucune demande en attente" description="Toutes les demandes ont été traitées." />
      )}

      {!isLoading && pendingRequests.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} mb={2}>
            En attente ({pendingRequests.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Demandeur</strong></TableCell>
                  <TableCell><strong>Nom du club</strong></TableCell>
                  <TableCell><strong>Catégorie</strong></TableCell>
                  <TableCell><strong>Motivation</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{req.userFullName}</Typography>
                      <Typography variant="caption" color="text.secondary">{req.userEmail}</Typography>
                    </TableCell>
                    <TableCell>{req.clubName}</TableCell>
                    <TableCell>{req.clubCategory}</TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography variant="body2" noWrap title={req.motivation}>{req.motivation}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" gap={1} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => setActionTarget({ request: req, action: 'approve' })}
                        >
                          Approuver
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => setActionTarget({ request: req, action: 'reject' })}
                        >
                          Refuser
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {!isLoading && processedRequests.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} mb={2}>Historique</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Demandeur</strong></TableCell>
                  <TableCell><strong>Nom du club</strong></TableCell>
                  <TableCell><strong>Catégorie</strong></TableCell>
                  <TableCell><strong>Statut</strong></TableCell>
                  <TableCell><strong>Commentaire</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.userFullName}</TableCell>
                    <TableCell>{req.clubName}</TableCell>
                    <TableCell>{req.clubCategory}</TableCell>
                    <TableCell>
                      <Chip label={statusLabel[req.status]} color={statusColor[req.status]} size="small" />
                    </TableCell>
                    <TableCell>{req.adminComment ?? '—'}</TableCell>
                    <TableCell>{formatDate(req.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Dialog de confirmation */}
      <Dialog open={!!actionTarget} onClose={() => { setActionTarget(null); setComment(''); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionTarget?.action === 'approve' ? 'Approuver la demande' : 'Refuser la demande'}
        </DialogTitle>
        <DialogContent>
          {actionTarget && (
            <Box>
              <Typography variant="body1" mb={1}>
                <strong>Club :</strong> {actionTarget.request.clubName}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Demandeur :</strong> {actionTarget.request.userFullName}
              </Typography>
              {actionTarget.action === 'approve' && (
                <Typography variant="body2" color="success.main" mb={2}>
                  Le club sera créé automatiquement et {actionTarget.request.userFullName} deviendra Admin Club
                  tout en gardant son rôle Membre.
                </Typography>
              )}
              <TextField
                label="Commentaire (optionnel)"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setActionTarget(null); setComment(''); }}>Annuler</Button>
          <Button
            variant="contained"
            color={actionTarget?.action === 'approve' ? 'success' : 'error'}
            onClick={handleConfirm}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            {actionTarget?.action === 'approve' ? 'Confirmer l\'approbation' : 'Confirmer le refus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
