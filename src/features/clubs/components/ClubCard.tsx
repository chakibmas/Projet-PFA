import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { Club } from '@/shared/types/club.types';
import { useNavigate } from 'react-router-dom';

interface Props {
  club: Club;
}

export function ClubCard({ club }: Props) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => navigate(`/clubs/${club.id}`)}
        sx={{ height: '100%' }}
        aria-label={`Voir les détails du club ${club.name}`}
      >
        <CardContent>
          <Stack direction="row" gap={2} alignItems="flex-start" mb={2}>
            <Avatar
              src={club.logoUrl}
              sx={{ width: 52, height: 52, bgcolor: 'primary.light' }}
              aria-hidden
            >
              {club.name[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {club.name}
              </Typography>
              <Chip label={club.category} size="small" variant="outlined" />
            </Box>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {club.description}
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.5} mt={2}>
            <GroupIcon fontSize="small" color="action" aria-hidden />
            <Typography variant="caption" color="text.secondary">
              {club.memberCount} membres
            </Typography>
            {club.statut !== 'VALIDE' && (
              <Chip label="Inactif" size="small" color="warning" sx={{ ml: 'auto' }} />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
