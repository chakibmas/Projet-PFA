import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { EventForm } from '../components/EventForm';
import { EventFormData } from '@/shared/types/event.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/eventsApi';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { useNavigate } from 'react-router-dom';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';

export function EventCreateEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const notify = useSnackbar();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id!),
    enabled: isEdit,
  });

  const createMutation = useMutation({
    mutationFn: (d: EventFormData) => eventsApi.create(d),
    onSuccess: (ev) => {
      qc.invalidateQueries({ queryKey: ['events'] });
      notify('Événement créé !', 'success');
      navigate(`/events/${ev.id}`);
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: (d: EventFormData) => eventsApi.update(id!, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      notify('Événement mis à jour !', 'success');
      navigate(`/events/${id}`);
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  if (isEdit && isLoading) return <LoadingSkeleton rows={6} />;

  return (
    <Box maxWidth={640} mx="auto" py={2}>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        {isEdit ? 'Modifier l\'événement' : 'Créer un événement'}
      </Typography>
      <EventForm
        defaultValues={existing}
        onSubmit={(d) => (isEdit ? updateMutation.mutate(d) : createMutation.mutate(d))}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Box>
  );
}
