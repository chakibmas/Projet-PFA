import { useState } from 'react';
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useClubs } from '../hooks/useClubs';
import { ClubCard } from '../components/ClubCard';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { getErrorMessage } from '@/shared/api/apiClient';

export function ClubsListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);

  const { data, isLoading, isError, error, refetch } = useClubs({ search, page, size: 12 });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Clubs & Associations
        </Typography>
        {hasRole(['PLATFORM_ADMIN', 'CLUB_ADMIN']) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/clubs/new')}
            aria-label="Créer un nouveau club"
          >
            Nouveau club
          </Button>
        )}
      </Stack>

      <TextField
        placeholder="Rechercher un club..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'aria-label': 'Rechercher un club' }}
        sx={{ mb: 3, maxWidth: 400 }}
        fullWidth
      />

      {isLoading && <LoadingSkeleton rows={6} height={180} />}
      {isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      )}
      {!isLoading && !isError && data?.content.length === 0 && (
        <EmptyState
          title="Aucun club trouvé"
          description="Essayez un autre terme de recherche ou créez un nouveau club."
        />
      )}
      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
            gap={3}
            mb={3}
          >
            {data.content.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </Box>
          <Stack direction="row" justifyContent="center" gap={2}>
            <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Précédent
            </Button>
            <Typography variant="body2" alignSelf="center">
              Page {page + 1} / {data.totalPages}
            </Typography>
            <Button disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Suivant
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
