import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, getErrorMessage } from '@/shared/api/apiClient';
import { useSnackbar } from '@/app/providers/SnackbarContext';
import { Notification } from '@/shared/types/notification.types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';

export function NotificationsPage() {
  const navigate = useNavigate();
  const notify = useSnackbar();
  const queryClient = useQueryClient();

  // ── Fetch notifications ─────────────────────────────────────────────────
  const { data: notifications, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiGet<Notification[]>('/api/notifications'),
  });

  // ── Mark all as read ────────────────────────────────────────────────────
  const markAllReadMutation = useMutation({
    mutationFn: () => apiPost<void>('/api/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      notify('Toutes les notifications ont ete marquees comme lues.', 'success');
    },
    onError: (err) => notify(getErrorMessage(err), 'error'),
  });

  const hasUnread = notifications?.some((n) => n.statut === 'NON_LUE') ?? false;

  const handleClick = (notification: Notification) => {
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <Box>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" fontWeight={700} component="h1">
          Notifications
        </Typography>

        {hasUnread && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            Tout marquer comme lu
          </Button>
        )}
      </Stack>

      {/* ── States ──────────────────────────────────────────────────────────── */}
      {isLoading && <LoadingSkeleton rows={5} height={60} />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {!isLoading && !isError && notifications?.length === 0 && (
        <EmptyState
          title="Aucune notification"
          description="Vous n'avez aucune notification pour le moment."
        />
      )}

      {/* ── List ────────────────────────────────────────────────────────────── */}
      {!isLoading && !isError && notifications && notifications.length > 0 && (
        <List disablePadding>
          {notifications.map((notif, index) => {
            const isUnread = notif.statut === 'NON_LUE';
            return (
              <Box key={notif.id}>
                <ListItemButton
                  onClick={() => handleClick(notif)}
                  sx={{
                    bgcolor: isUnread ? 'action.hover' : 'transparent',
                    borderRadius: 1,
                  }}
                >
                  {isUnread && (
                    <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mr: 1.5 }} />
                  )}
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        fontWeight={isUnread ? 700 : 400}
                      >
                        {notif.message}
                      </Typography>
                    }
                    secondary={new Date(notif.dateEnvoi).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  />
                </ListItemButton>
                {index < notifications.length - 1 && <Divider component="li" />}
              </Box>
            );
          })}
        </List>
      )}
    </Box>
  );
}
