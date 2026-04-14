import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useChangePassword } from '@/features/auth/hooks/useAuthMutations';
import { ChangePasswordRequest } from '@/shared/types/auth.types';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(6, 'Minimum 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: FormValues) {
    await changePasswordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    } as ChangePasswordRequest);

    // Clear form on success
    reset();
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Changer le mot de passe
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <Alert severity="info">
            Pour votre sécurité, entrez votre mot de passe actuel avant d'en définir un nouveau.
          </Alert>

          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mot de passe actuel"
                type="password"
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
                fullWidth
                disabled={changePasswordMutation.isPending}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nouveau mot de passe"
                type="password"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                fullWidth
                disabled={changePasswordMutation.isPending}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmer le mot de passe"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                fullWidth
                disabled={changePasswordMutation.isPending}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={changePasswordMutation.isPending}
            startIcon={changePasswordMutation.isPending && <CircularProgress size={20} />}
          >
            {changePasswordMutation.isPending ? 'Changement...' : 'Changer le mot de passe'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
