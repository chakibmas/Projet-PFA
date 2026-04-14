import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import { EventFormData } from '@/shared/types/event.types';

const schema = z
  .object({
    clubId: z.string().min(1, 'Club requis'),
    title: z.string().min(3, 'Titre requis'),
    description: z.string().min(10, 'Description requise'),
    location: z.string().min(2, 'Lieu requis'),
    startDate: z.string().min(1, 'Date de début requise'),
    endDate: z.string().min(1, 'Date de fin requise'),
    maxParticipants: z.coerce.number().positive().optional(),
    isPublic: z.boolean(),
    requiresRegistration: z.boolean(),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate'],
  });

interface Props {
  defaultValues?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export function EventForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: true, requiresRegistration: true, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2}>
        <TextField
          label="ID du club *"
          {...register('clubId')}
          error={!!errors.clubId}
          helperText={errors.clubId?.message}
          fullWidth
        />
        <TextField
          label="Titre *"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />
        <TextField
          label="Description *"
          multiline
          rows={4}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
        />
        <TextField
          label="Lieu *"
          {...register('location')}
          error={!!errors.location}
          helperText={errors.location?.message}
          fullWidth
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            label="Date de début *"
            type="datetime-local"
            {...register('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Date de fin *"
            type="datetime-local"
            {...register('endDate')}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>
        <TextField
          label="Capacité max (optionnel)"
          type="number"
          {...register('maxParticipants')}
          error={!!errors.maxParticipants}
          helperText={errors.maxParticipants?.message}
          fullWidth
        />
        <Stack direction="row" gap={2}>
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Événement public"
              />
            )}
          />
          <Controller
            name="requiresRegistration"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Inscription requise"
              />
            )}
          />
        </Stack>
        <Button type="submit" variant="contained" size="large" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enregistrer'}
        </Button>
      </Stack>
    </form>
  );
}
