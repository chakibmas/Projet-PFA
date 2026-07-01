import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress, Stack,
  TextField, Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { clubRequestsApi } from '../api/clubRequestsApi';
import { CreateClubRequestData, ClubRequestStatus } from '@/shared/types/clubRequest.types';

const schema = z.object({
  clubName: z.string().min(2, 'Nom requis (min 2 caractères)'),
  clubDescription: z.string().min(10, 'Description requise (min 10 caractères)'),
  clubCategory: z.string().min(1, 'Catégorie requise'),
  logoUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  motivation: z.string().min(20, 'Motivation requise (min 20 caractères)'),
});

const statusColor: Record<ClubRequestStatus, 'warning' | 'success' | 'error'> = {
  EN_ATTENTE: 'warning',
  APPROUVEE: 'success',
  REFUSEE: 'error',
};
const statusLabel: Record<ClubRequestStatus, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVEE: 'Approuvée',
  REFUSEE: 'Refusée',
};

export function CreateClubRequestPage() {
  const notify = useSnackbar();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: myRequests, isLoading } = useQuery({
    queryKey: ['club-requests', 'me'],
    queryFn: () => clubRequestsApi.getMyRequests(),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClubRequestData>({
    resolver: zodResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateClubRequestData) => clubRequestsApi.create(data),
    onSuccess: () => {
      notify('Demande envoyée avec succès ! L\'administrateur va l\'examiner.', 'success');
      reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['club-requests', 'me'] });
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const hasPendingRequest = myRequests?.some((r) => r.status === 'EN_ATTENTE');

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Demande de création de club
        </Typography>
        {!showForm && !hasPendingRequest && (
          <Button variant="contained" startIcon={<SendIcon />} onClick={() => setShowForm(true)}>
            Nouvelle demande
          </Button>
        )}
      </Stack>

      {hasPendingRequest && !showForm && (
        <Card variant="outlined" sx={{ mb: 3, bgcolor: 'warning.50' }}>
          <CardContent>
            <Typography variant="body1" color="warning.main" fontWeight={600}>
              Vous avez déjà une demande en attente. Veuillez patienter jusqu'à ce qu'elle soit traitée.
            </Typography>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Proposer un nouveau club
            </Typography>
            <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} noValidate>
              <Stack gap={2}>
                <TextField
                  label="Nom du club *"
                  {...register('clubName')}
                  error={!!errors.clubName}
                  helperText={errors.clubName?.message}
                  fullWidth
                />
                <TextField
                  label="Description du club *"
                  multiline
                  rows={3}
                  {...register('clubDescription')}
                  error={!!errors.clubDescription}
                  helperText={errors.clubDescription?.message}
                  fullWidth
                />
                <TextField
                  label="Catégorie *"
                  {...register('clubCategory')}
                  error={!!errors.clubCategory}
                  helperText={errors.clubCategory?.message}
                  placeholder="Ex: Technologie, Arts, Sport..."
                  fullWidth
                />
                <TextField
                  label="URL du logo (optionnel)"
                  {...register('logoUrl')}
                  error={!!errors.logoUrl}
                  helperText={errors.logoUrl?.message}
                  fullWidth
                />
                <TextField
                  label="Motivation *"
                  multiline
                  rows={4}
                  {...register('motivation')}
                  error={!!errors.motivation}
                  helperText={errors.motivation?.message ?? 'Expliquez pourquoi vous souhaitez créer ce club et comment vous comptez le gérer.'}
                  fullWidth
                />
                <Stack direction="row" gap={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={createMutation.isPending}
                    startIcon={createMutation.isPending ? <CircularProgress size={18} /> : <SendIcon />}
                  >
                    Envoyer la demande
                  </Button>
                  <Button variant="outlined" onClick={() => { setShowForm(false); reset(); }}>
                    Annuler
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" fontWeight={600} mb={2}>Mes demandes</Typography>
      {isLoading && <CircularProgress />}
      {!isLoading && (!myRequests || myRequests.length === 0) && (
        <Typography variant="body2" color="text.secondary">
          Vous n'avez encore soumis aucune demande de création de club.
        </Typography>
      )}
      {!isLoading && myRequests && myRequests.length > 0 && (
        <Stack spacing={2}>
          {myRequests.map((req) => (
            <Card key={req.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>{req.clubName}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Catégorie : {req.clubCategory}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      {req.clubDescription}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Soumis le {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </Typography>
                    {req.adminComment && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Commentaire admin : {req.adminComment}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={statusLabel[req.status]}
                    color={statusColor[req.status]}
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
