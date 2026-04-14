import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, getErrorMessage } from '@/shared/api/apiClient';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import type { User, UserRole } from '@/shared/types/auth.types';

// ── Role chip color mapping ──────────────────────────────────────────────────

const roleColor: Record<UserRole, 'error' | 'primary' | 'success' | 'default'> = {
  PLATFORM_ADMIN: 'error',
  CLUB_ADMIN: 'primary',
  MEMBER: 'success',
  VISITOR: 'default',
};

const roleLabel: Record<UserRole, string> = {
  PLATFORM_ADMIN: 'Admin plateforme',
  CLUB_ADMIN: 'Admin club',
  MEMBER: 'Membre',
  VISITOR: 'Visiteur',
};

const ALL_ROLES: UserRole[] = ['PLATFORM_ADMIN', 'CLUB_ADMIN', 'MEMBER', 'VISITOR'];

// ── Page ──────────────────────────────────────────────────────────────────────

export function ManageUsersPage() {
  const notify = useSnackbar();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // ── Fetch users ──────────────────────────────────────────────────────────
  const { data: users, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiGet<User[]>('/api/admin/users'),
  });

  // ── Change role mutation ─────────────────────────────────────────────────
  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      apiPut(`/api/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      notify('Rôle mis à jour avec succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  // ── Client-side filtering ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} component="h1" mb={3}>
        Gestion des utilisateurs
      </Typography>

      {/* Search bar */}
      <TextField
        placeholder="Rechercher par nom ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'aria-label': 'Rechercher un utilisateur' }}
        sx={{ mb: 3, maxWidth: 400 }}
        fullWidth
      />

      {isLoading && (
        <Stack gap={1}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={52} />
          ))}
        </Stack>
      )}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="Aucun utilisateur trouvé"
          description={search ? 'Essayez un autre terme de recherche.' : 'Aucun utilisateur enregistré.'}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Rôle</strong></TableCell>
                <TableCell><strong>Date création</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={roleLabel[user.role]}
                      color={roleColor[user.role]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Select
                      value={user.role}
                      size="small"
                      onChange={(e) =>
                        changeRoleMutation.mutate({
                          userId: user.id,
                          role: e.target.value as UserRole,
                        })
                      }
                      disabled={changeRoleMutation.isPending}
                      sx={{ minWidth: 160 }}
                      aria-label={`Changer le rôle de ${user.firstName}`}
                    >
                      {ALL_ROLES.map((role) => (
                        <MenuItem key={role} value={role}>
                          {roleLabel[role]}
                        </MenuItem>
                      ))}
                    </Select>
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
