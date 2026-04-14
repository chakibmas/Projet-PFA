import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { Event } from '@/shared/types/event.types';
import { useNavigate } from 'react-router-dom';

interface Props {
  event: Event;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventCard({ event }: Props) {
  const navigate = useNavigate();
  const isFull =
    event.maxParticipants !== undefined && event.registeredCount >= event.maxParticipants;

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        onClick={() => navigate(`/events/${event.id}`)}
        sx={{ height: '100%' }}
        aria-label={`Voir l'événement ${event.title}`}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography variant="subtitle1" fontWeight={700} flex={1} pr={1}>
              {event.title}
            </Typography>
            {isFull && <Chip label="Complet" size="small" color="error" />}
            {!event.isPublic && <Chip label="Privé" size="small" variant="outlined" />}
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </Typography>

          <Stack gap={0.5}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <EventIcon fontSize="small" color="action" aria-hidden />
              <Typography variant="caption" color="text.secondary">
                {formatDate(event.startDate)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <LocationOnIcon fontSize="small" color="action" aria-hidden />
              <Typography variant="caption" color="text.secondary" noWrap>
                {event.location}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <PeopleIcon fontSize="small" color="action" aria-hidden />
              <Typography variant="caption" color="text.secondary">
                {event.registeredCount}
                {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} inscrits
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
