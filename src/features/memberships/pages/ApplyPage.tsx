import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { membershipsApi } from '../api/membershipsApi';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { useClub } from '@/features/clubs/hooks/useClubs';

const schema = z.object({
  motivation: z.string().min(10, 'Veuillez détailler votre motivation (min 10 caractères)').max(500),
});
type FormValues = z.infer<typeof schema>;

export function ApplyPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const notify = useSnackbar();
  const { data: club } = useClub(clubId!);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      membershipsApi.apply({ clubId: clubId!, motivation: data.motivation }),
    onSuccess: () => {
      notify('Demande d\'adhésion envoyée !', 'success');
      navigate('/memberships');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  return (
    <Box maxWidth={560} mx="auto" py={2}>
      <Typography variant="h5" fontWeight={700} mb={1} component="h1">
        Rejoindre {club?.name ?? '...'}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Votre demande sera examinée par l'administrateur du club.
      </Typography>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
        <Stack gap={2}>
          <TextField
            label="Motivation *"
            multiline
            rows={5}
            {...register('motivation')}
            error={!!errors.motivation}
            helperText={errors.motivation?.message}
            inputProps={{ 'aria-label': 'Motivation pour rejoindre le club' }}
            fullWidth
          />
          <Stack direction="row" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)} aria-label="Annuler">
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              aria-label="Envoyer ma demande"
            >
              {mutation.isPending ? <CircularProgress size={22} color="inherit" /> : 'Envoyer ma demande'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
