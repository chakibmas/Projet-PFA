import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/eventsApi';
import { EventCard } from '../components/EventCard';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { getErrorMessage } from '@/shared/api/apiClient';

export function EventsListPage() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', page],
    queryFn: () => eventsApi.list({ page, size: 12 }),
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Événements
        </Typography>
        {hasRole(['CLUB_ADMIN', 'PLATFORM_ADMIN']) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/new')}
            aria-label="Créer un événement"
          >
            Nouvel événement
          </Button>
        )}
      </Stack>

      {isLoading && <LoadingSkeleton rows={6} height={180} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.content.length === 0 && (
        <EmptyState title="Aucun événement" description="Il n'y a pas d'événements à afficher." />
      )}

      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={3}
            mb={3}
          >
            {data.content.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </Box>
          <Stack direction="row" justifyContent="center" gap={2}>
            <Button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
            <Typography variant="body2" alignSelf="center">
              Page {page + 1} / {data.totalPages}
            </Typography>
            <Button disabled={page >= data.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
