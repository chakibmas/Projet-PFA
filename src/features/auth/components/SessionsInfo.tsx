import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useGetSessions, useRevokeSession } from '@/features/auth/hooks/useAuthMutations';
import { ErrorState } from '@/shared/components/ErrorState';

export function SessionsInfo() {
  const sessionsQuery = useGetSessions();
  const revokeMutation = useRevokeSession();
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Determine current session (most recent)
  const currentSessionId = sessionsQuery.data?.[0]?.id;

  function handleRevokeClick(sessionId: string) {
    setSelectedSessionId(sessionId);
    setRevokeDialogOpen(true);
  }

  async function handleConfirmRevoke() {
    if (selectedSessionId) {
      await revokeMutation.mutateAsync(selectedSessionId);
      setRevokeDialogOpen(false);
      setSelectedSessionId(null);
    }
  }

  if (sessionsQuery.isLoading) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Connexions actives
        </Typography>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  if (sessionsQuery.isError) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Connexions actives
        </Typography>
        <ErrorState
          message="Impossible de charger les sessions"
          onRetry={() => sessionsQuery.refetch()}
        />
      </Box>
    );
  }

  const sessions = sessionsQuery.data || [];

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Connexions actives
      </Typography>

      {sessions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucune session active trouvée.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell>Adresse IP</TableCell>
                <TableCell>Navigateur</TableCell>
                <TableCell>Dernière activité</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <TableRow
                    key={session.id}
                    sx={{
                      backgroundColor: isCurrent ? 'action.hover' : 'inherit',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" gap={1} alignItems="center">
                        {session.ipAddress}
                        {isCurrent && <Chip label="Actuelle" size="small" color="primary" />}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {new URL(`https://${session.userAgent}`).hostname || session.userAgent}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(session.lastActive).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={
                          revokeMutation.isPending ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        onClick={() => handleRevokeClick(session.id)}
                        disabled={isCurrent || revokeMutation.isPending}
                        title={
                          isCurrent ? 'Impossible de révoquer la session actuelle' : 'Révoquer'
                        }
                      >
                        Révoquer
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={revokeDialogOpen} onClose={() => setRevokeDialogOpen(false)}>
        <DialogTitle>Révoquer la session ?</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir terminer cette session ? Vous en serez déconnecté.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmRevoke}
            variant="contained"
            color="error"
            disabled={revokeMutation.isPending}
          >
            {revokeMutation.isPending ? 'Révocation...' : 'Révoquer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
