import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, useParams } from 'react-router-dom';
import { useClub } from '../hooks/useClubs';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { useAuthStore } from '@/features/auth/store/authStore';
import { getErrorMessage } from '@/shared/api/apiClient';

export function ClubDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const user = useAuthStore((s) => s.user);
  const { data: club, isLoading, isError, error, refetch } = useClub(id!);

  if (isLoading) return <LoadingSkeleton rows={4} height={60} />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  if (!club) return null;

  const isClubAdmin = hasRole(['PLATFORM_ADMIN']) || (hasRole(['CLUB_ADMIN']) && club.adminId === user?.id);

  return (
    <Box maxWidth={800} mx="auto">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar src={club.logoUrl} sx={{ width: 64, height: 64, bgcolor: 'primary.light' }} aria-hidden>
            {club.name[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} component="h1">
              {club.name}
            </Typography>
            <Stack direction="row" gap={1} mt={0.5}>
              <Chip label={club.category} size="small" variant="outlined" />
              {club.statut !== 'VALIDE' && <Chip label="Inactif" size="small" color="warning" />}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" gap={1}>
          {isClubAdmin && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/clubs/${club.id}/edit`)}
              aria-label="Modifier ce club"
            >
              Modifier
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate(`/memberships/apply/${club.id}`)}
            aria-label="Rejoindre ce club"
          >
            Rejoindre
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" mb={3} style={{ whiteSpace: 'pre-wrap' }}>
        {club.description}
      </Typography>

      <Stack direction="row" alignItems="center" gap={1}>
        <GroupIcon color="action" aria-hidden />
        <Typography variant="body2" color="text.secondary">
          {club.memberCount} membres
        </Typography>
        {isClubAdmin && (
          <Button
            size="small"
            variant="text"
            onClick={() => navigate(`/clubs/${club.id}/memberships`)}
            sx={{ ml: 2 }}
          >
            Gérer les adhésions
          </Button>
        )}
      </Stack>
    </Box>
  );
}
