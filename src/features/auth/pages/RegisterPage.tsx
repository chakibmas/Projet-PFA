import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '@/shared/api/apiClient';
import { useAuthStore } from '../store/authStore';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { LoginResponse } from '@/shared/types/auth.types';

const schema = z
  .object({
    firstName: z.string().min(2, 'Minimum 2 caractères'),
    lastName: z.string().min(2, 'Minimum 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm'],
  });
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const notify = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Omit<FormValues, 'confirm'>) =>
      apiPost<LoginResponse>('/api/auth/register', data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken, res.refreshToken);
      notify(`Bienvenue, ${res.user.firstName} ! Votre compte a été créé.`, 'success');
      navigate('/dashboard');
    },
    onError: () => notify("Erreur lors de la création du compte. Veuillez réessayer.", 'error'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirm: _c, ...data }: FormValues) => mutate(data);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
    >
      <Card sx={{ maxWidth: 460, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" mb={3} gap={1}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} aria-hidden />
            <Typography variant="h5" fontWeight={700} component="h1">
              Créer un compte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejoignez la communauté UniClubs
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                <TextField
                  label="Prénom"
                  autoComplete="given-name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                  inputProps={{ 'aria-label': 'Prénom' }}
                />
                <TextField
                  label="Nom"
                  autoComplete="family-name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                  inputProps={{ 'aria-label': 'Nom' }}
                />
              </Stack>
              <TextField
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                inputProps={{ 'aria-label': 'Adresse e-mail' }}
              />
              <TextField
                label="Mot de passe"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                inputProps={{ 'aria-label': 'Mot de passe' }}
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                autoComplete="new-password"
                {...register('confirm')}
                error={!!errors.confirm}
                helperText={errors.confirm?.message}
                fullWidth
                inputProps={{ 'aria-label': 'Confirmer le mot de passe' }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isPending}
                fullWidth
                aria-label="Créer mon compte"
              >
                {isPending ? <CircularProgress size={24} color="inherit" /> : "Créer mon compte"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" textAlign="center">
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Se connecter
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
