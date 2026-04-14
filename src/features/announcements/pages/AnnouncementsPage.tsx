import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { announcementsApi } from '../api/announcementsApi';
import { AnnouncementFormData } from '@/shared/types/announcement.types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { getErrorMessage } from '@/shared/api/apiClient';
import { useAuthStore } from '@/features/auth/store/authStore';

const schema = z.object({
  title: z.string().min(3, 'Titre requis'),
  content: z.string().min(10, 'Contenu requis'),
  clubId: z.string().optional(),
  targetRole: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function AnnouncementsPage() {
  const [open, setOpen] = useState(false);
  const notify = useSnackbar();
  const qc = useQueryClient();
  const hasRole = useAuthStore((s) => s.hasRole);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.list(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (d: AnnouncementFormData) => announcementsApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['announcements'] });
      notify('Annonce publiée !', 'success');
      setOpen(false);
      reset();
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700} component="h1">
          Annonces
        </Typography>
        {hasRole(['CLUB_ADMIN', 'PLATFORM_ADMIN']) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Nouvelle annonce
          </Button>
        )}
      </Stack>

      {isLoading && <LoadingSkeleton rows={4} height={90} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}
      {!isLoading && !isError && data?.length === 0 && (
        <EmptyState title="Aucune annonce" icon={<CampaignIcon sx={{ fontSize: 64, color: 'text.disabled' }} />} />
      )}

      {!isLoading && !isError && data && (
        <Stack gap={2}>
          {data.map((a) => (
            <Card key={a.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                  <Typography variant="subtitle1" fontWeight={600}>{a.title}</Typography>
                  <Stack direction="row" gap={1}>
                    {a.clubName && <Chip label={a.clubName} size="small" variant="outlined" />}
                    {a.targetRole && <Chip label={a.targetRole} size="small" color="info" />}
                  </Stack>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">{a.content}</Typography>
                <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                  Par {a.authorName} – {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvelle annonce</DialogTitle>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} noValidate>
          <DialogContent>
            <Stack gap={2} pt={1}>
              <TextField label="Titre *" {...register('title')} error={!!errors.title} helperText={errors.title?.message} fullWidth />
              <TextField label="Contenu *" multiline rows={4} {...register('content')} error={!!errors.content} helperText={errors.content?.message} fullWidth />
              <TextField label="ID du club (optionnel)" {...register('clubId')} fullWidth />
              <TextField label="Rôle cible (optionnel)" {...register('targetRole')} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={mutation.isPending}>
              {mutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Publier'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
