import {
  Box,
  Button,
  Paper,
  Stack,
  Switch,
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
import { apiGet, apiPut, getErrorMessage } from '@/shared/api/apiClient';
import { membershipsApi } from '@/features/memberships/api/membershipsApi';
import { MembershipStatusChip } from '@/features/memberships/components/MembershipStatusChip';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { Membership } from '@/shared/types/membership.types';
import { PagedResponse } from '@/shared/types/club.types';

export function ClubMembersPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const notify = useSnackbar();
  const qc = useQueryClient();

  /* ── Fetch ALL memberships (no status filter) ────────────────────────── */
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['club-members', clubId],
    queryFn: () =>
      apiGet<PagedResponse<Membership>>(`/api/clubs/${clubId}/memberships`),
    enabled: !!clubId,
  });

  /* ── Approve / Reject mutations ──────────────────────────────────────── */
  const approveMutation = useMutation({
    mutationFn: (id: string) => membershipsApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['club-members', clubId] });
      notify('Adh\u00e9sion approuv\u00e9e', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => membershipsApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['club-members', clubId] });
      notify('Adh\u00e9sion refus\u00e9e', 'info');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  /* ── Toggle cotisation ───────────────────────────────────────────────── */
  const cotisationMutation = useMutation({
    mutationFn: ({ id, paid }: { id: string; paid: boolean }) =>
      apiPut<Membership>(`/api/memberships/${id}/cotisation`, { cotisationPayee: paid }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['club-members', clubId] });
      notify(
        variables.paid ? 'Cotisation marqu\u00e9e comme pay\u00e9e' : 'Cotisation marqu\u00e9e comme non pay\u00e9e',
        'success',
      );
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Membres du club
      </Typography>

      {isLoading && <LoadingSkeleton rows={5} height={52} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.content.length === 0 && (
        <EmptyState title="Aucun membre" description="Ce club n'a pas encore de membres." />
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="Liste des membres du club">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date demande</TableCell>
                <TableCell>Cotisation</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{m.userFullName}</TableCell>
                  <TableCell>{m.userEmail}</TableCell>
                  <TableCell>
                    <MembershipStatusChip status={m.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(m.appliedAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {m.status === 'APPROUVEE' ? (
                      <Switch
                        checked={m.cotisationPayee}
                        onChange={(_, checked) =>
                          cotisationMutation.mutate({ id: m.id, paid: checked })
                        }
                        disabled={cotisationMutation.isPending}
                        size="small"
                        aria-label={`Cotisation pay\u00e9e pour ${m.userFullName}`}
                      />
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        &mdash;
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {m.status === 'EN_ATTENTE' ? (
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
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        &mdash;
                      </Typography>
                    )}
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
