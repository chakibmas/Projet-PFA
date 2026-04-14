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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => login({ ...data, _next: nextPath } as never);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" mb={3} gap={1}>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} aria-hidden />
            <Typography variant="h5" fontWeight={700} component="h1">
              UniClubs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous à votre espace
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={2}>
              <TextField
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                inputProps={{ 'aria-label': 'Adresse e-mail' }}
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                inputProps={{ 'aria-label': 'Mot de passe' }}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoginPending}
                fullWidth
                aria-label="Se connecter"
              >
                {isLoginPending ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 2 }}>ou</Divider>

          {/* Visitor browse without account */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<VisibilityIcon />}
            onClick={() => navigate('/clubs')}
            aria-label="Parcourir sans compte"
            sx={{ mb: 2 }}
          >
            Parcourir sans compte
          </Button>

          <Typography variant="body2" textAlign="center">
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
              S'inscrire gratuitement
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
