import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { ClubFormData } from '@/shared/types/club.types';

const schema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  description: z.string().min(10, 'Description requise (min 10 caractères)'),
  category: z.string().min(1, 'Catégorie requise'),
  logoUrl: z.string().url('URL invalide').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<ClubFormData>;
  onSubmit: (data: ClubFormData) => void;
  isLoading?: boolean;
}

export function ClubForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2}>
        <TextField
          label="Nom du club *"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          inputProps={{ 'aria-label': 'Nom du club' }}
          fullWidth
        />
        <TextField
          label="Description *"
          multiline
          rows={4}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          inputProps={{ 'aria-label': 'Description' }}
          fullWidth
        />
        <TextField
          label="Catégorie *"
          {...register('category')}
          error={!!errors.category}
          helperText={errors.category?.message}
          inputProps={{ 'aria-label': 'Catégorie' }}
          fullWidth
        />
        <TextField
          label="URL du logo (optionnel)"
          {...register('logoUrl')}
          error={!!errors.logoUrl}
          helperText={errors.logoUrl?.message}
          inputProps={{ 'aria-label': 'URL du logo' }}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          aria-label="Enregistrer"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enregistrer'}
        </Button>
      </Stack>
    </form>
  );
}
