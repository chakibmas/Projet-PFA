import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { eventsApi } from '../api/eventsApi';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const notify = useSnackbar();
  const qc = useQueryClient();
  const [checkInCode, setCheckInCode] = useState('');

  const { data: event, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.register(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events', id] });
      notify('Inscription confirmée !', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const checkInMutation = useMutation({
    mutationFn: () => eventsApi.checkIn(id!, { code: checkInCode }),
    onSuccess: () => notify('Check-in effectué !', 'success'),
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  if (isLoading) return <LoadingSkeleton rows={4} height={60} />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  if (!event) return null;

  const isFull = event.maxParticipants !== undefined && event.registeredCount >= event.maxParticipants;
  const isAdmin = hasRole(['CLUB_ADMIN', 'PLATFORM_ADMIN']);

  return (
    <Box maxWidth={800} mx="auto">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={2}>
        <Box flex={1}>
          <Stack direction="row" gap={1} mb={1} flexWrap="wrap">
            {!event.isPublic && <Chip label="Privé" size="small" variant="outlined" />}
            {isFull && <Chip label="Complet" size="small" color="error" />}
          </Stack>
          <Typography variant="h5" fontWeight={700} component="h1">{event.title}</Typography>
          <Typography variant="caption" color="text.secondary">{event.clubName}</Typography>
        </Box>
        {isAdmin && (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/events/${id}/edit`)}>
            Modifier
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack gap={1.5} mb={3}>
        <Stack direction="row" alignItems="center" gap={1}>
          <EventIcon color="action" aria-hidden />
          <Typography variant="body2">
            Du {new Date(event.startDate).toLocaleString('fr-FR')} au {new Date(event.endDate).toLocaleString('fr-FR')}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <LocationOnIcon color="action" aria-hidden />
          <Typography variant="body2">{event.location}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <PeopleIcon color="action" aria-hidden />
          <Typography variant="body2">
            {event.registeredCount}{event.maxParticipants ? ` / ${event.maxParticipants}` : ''} inscrits
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body1" mb={4} style={{ whiteSpace: 'pre-wrap' }}>
        {event.description}
      </Typography>

      {event.requiresRegistration && (
        <Button
          variant="contained"
          size="large"
          disabled={isFull || registerMutation.isPending}
          onClick={() => registerMutation.mutate()}
          aria-label="S'inscrire à cet événement"
          sx={{ mb: 3 }}
        >
          {registerMutation.isPending ? <CircularProgress size={22} color="inherit" /> : "S'inscrire"}
        </Button>
      )}

      {isAdmin && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            <QrCodeScannerIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} aria-hidden />
            Check-in manuel
          </Typography>
          <Stack direction="row" gap={2} maxWidth={360}>
            <TextField
              placeholder="Code de check-in"
              size="small"
              value={checkInCode}
              onChange={(e) => setCheckInCode(e.target.value)}
              inputProps={{ 'aria-label': 'Code de check-in' }}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => checkInMutation.mutate()}
              disabled={!checkInCode || checkInMutation.isPending}
              aria-label="Valider le check-in"
            >
              Valider
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
