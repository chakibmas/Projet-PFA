import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ClubForm } from '../components/ClubForm';
import { useClub, useCreateClub, useUpdateClub } from '../hooks/useClubs';
import { ClubFormData } from '@/shared/types/club.types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';

export function ClubCreateEditPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { data: existing, isLoading } = useClub(id ?? '');
  const createMutation = useCreateClub();
  const updateMutation = useUpdateClub(id ?? '');

  const handleSubmit = (data: ClubFormData) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  if (isEdit && isLoading) return <LoadingSkeleton rows={4} />;

  return (
    <Box maxWidth={600} mx="auto" py={2}>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        {isEdit ? 'Modifier le club' : 'Créer un nouveau club'}
      </Typography>
      <ClubForm
        defaultValues={existing}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </Box>
  );
}
