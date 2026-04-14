import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membershipsApi } from '../api/membershipsApi';
import { MembershipStatusChip } from '../components/MembershipStatusChip';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';

export function AdminMembershipsPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const notify = useSnackbar();
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['club-memberships', clubId],
    queryFn: () => membershipsApi.getClubMemberships(clubId!, 'PENDING'),
    enabled: !!clubId,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => membershipsApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['club-memberships', clubId] });
      notify('Adhésion approuvée', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => membershipsApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['club-memberships', clubId] });
      notify('Adhésion refusée', 'info');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Demandes d'adhésion en attente
      </Typography>

      {isLoading && <LoadingSkeleton rows={4} height={52} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.content.length === 0 && (
        <EmptyState title="Aucune demande" description="Il n'y a pas de demandes en attente." />
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="Demandes d'adhésion">
            <TableHead>
              <TableRow>
                <TableCell>Membre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Motivation</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.userFullName}</TableCell>
                  <TableCell>{m.userEmail}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={m.motivation}>
                      {m.motivation ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <MembershipStatusChip status={m.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(m.appliedAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => approveMutation.mutate(m.id)}
                        disabled={approveMutation.isPending}
                        aria-label={`Approuver ${m.userFullName}`}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => rejectMutation.mutate(m.id)}
                        disabled={rejectMutation.isPending}
                        aria-label={`Refuser ${m.userFullName}`}
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
      )}
    </Box>
  );
}
