import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { AvatarUpload } from '../components/AvatarUpload';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { SessionsInfo } from '../components/SessionsInfo';

const roleLabels: Record<string, string> = {
  PLATFORM_ADMIN: 'Admin Plateforme',
  CLUB_ADMIN: 'Admin Club',
  MEMBER: 'Membre',
  VISITOR: 'Visiteur',
};

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <Box maxWidth={900} mx="auto" py={4}>
      <Typography variant="h5" fontWeight={700} mb={3} component="h1">
        Mon profil
      </Typography>

      {/* ── User Info Section (Read-only) ──────────────────────────────────── */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" gap={3} alignItems="center" mb={3}>
            <Avatar
              src={user.avatarUrl}
              sx={{ width: 72, height: 72, fontSize: 28, bgcolor: 'primary.main' }}
              aria-label={`Avatar de ${fullName}`}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Chip
                label={roleLabels[user.role] ?? user.role}
                color="primary"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
          <Divider />
          <Stack gap={1.5} mt={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>ID utilisateur : </strong>
              {user.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Inscrit le : </strong>
              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Editable Sections ────────────────────────────────────────────────── */}

      {/* Avatar Upload */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <AvatarUpload />
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <PersonalInfoForm />
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <SessionsInfo />
        </CardContent>
      </Card>
    </Box>
  );
}
