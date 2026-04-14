import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, Stack, TextField, Typography, CircularProgress } from '@mui/material';
import { useUpdateProfile } from '@/features/auth/hooks/useAuthMutations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UpdateProfileRequest } from '@/shared/types/auth.types';

const schema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
});

type FormValues = z.infer<typeof schema>;

export function PersonalInfoForm() {
  const { user } = useAuth();
  const updateMutation = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
  }, [user?.firstName, user?.lastName, reset]);

  async function onSubmit(data: FormValues) {
    await updateMutation.mutateAsync(data as UpdateProfileRequest);
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Informations personnelles
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Prénom"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                disabled={updateMutation.isPending}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nom"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                disabled={updateMutation.isPending}
              />
            )}
          />

          <Stack direction="row" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || updateMutation.isPending}
              startIcon={updateMutation.isPending && <CircularProgress size={20} />}
            >
              {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            {isDirty && (
              <Button
                variant="outlined"
                onClick={() =>
                  reset({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                  })
                }
              >
                Annuler
              </Button>
            )}
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
