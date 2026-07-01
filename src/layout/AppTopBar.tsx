import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/auth.types';
import { apiGet } from '@/shared/api/apiClient';
import type { Notification } from '@/shared/types/notification.types';

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  PLATFORM_ADMIN: { label: 'Admin Plateforme', color: '#1565C0' },
  CLUB_ADMIN:     { label: 'Admin Club',        color: '#2E7D32' },
  MEMBER:         { label: 'Membre',            color: '#6A1B9A' },
  VISITOR:        { label: 'Visiteur',          color: '#BF360C' },
};

interface Props {
  onMenuClick: () => void;
}

export function AppTopBar({ onMenuClick }: Props) {
  const { user, logout, isAuthenticated, activeRole } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiGet<Notification[]>('/api/notifications'),
    enabled: isAuthenticated,
  });

  const unreadCount = notifications?.filter((n) => n.statut === 'NON_LUE').length ?? 0;

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';
  const currentRole = activeRole ?? user?.role ?? 'VISITOR';
  const roleMeta = ROLE_META[currentRole];

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      aria-label="Barre de navigation principale"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Ouvrir le menu"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Stack direction="row" alignItems="center" gap={1} flex={1}>
          <SchoolIcon aria-hidden />
          <Typography variant="h6" fontWeight={700} component="span">
            UniClubs
          </Typography>
        </Stack>

        {isAuthenticated && user ? (
          <>
            {/* Role chip — desktop only */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
              <Chip
                label={roleMeta.label}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
            </Box>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                aria-label="Notifications"
                sx={{ mr: 1 }}
                onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(notifAnchorEl)}
              anchorEl={notifAnchorEl}
              onClose={() => setNotifAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { width: 360, maxHeight: 420 } } }}
            >
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography variant="caption" color="primary">{unreadCount} non lue(s)</Typography>
                )}
              </Box>
              <Divider />

              {(!notifications || notifications.length === 0) ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Aucune notification</Typography>
                </Box>
              ) : (
                <List disablePadding sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.slice(0, 5).map((notif, index) => {
                    const isUnread = notif.statut === 'NON_LUE';
                    return (
                      <Box key={notif.id}>
                        <ListItemButton
                          onClick={() => {
                            setNotifAnchorEl(null);
                            if (notif.link) navigate(notif.link);
                          }}
                          sx={{ bgcolor: isUnread ? 'action.hover' : 'transparent' }}
                        >
                          {isUnread && <CircleIcon sx={{ fontSize: 8, color: 'primary.main', mr: 1.5 }} />}
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={isUnread ? 700 : 400} noWrap>
                                {notif.message}
                              </Typography>
                            }
                            secondary={new Date(notif.dateEnvoi).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                          />
                        </ListItemButton>
                        {index < Math.min(notifications.length, 5) - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </List>
              )}

              <Divider />
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button
                  size="small"
                  onClick={() => { setNotifAnchorEl(null); navigate('/notifications'); }}
                >
                  Voir toutes les notifications
                </Button>
              </Box>
            </Popover>

            {/* User avatar menu */}
            <Tooltip title={`${user.firstName} ${user.lastName}`}>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label={`Menu utilisateur – ${user.firstName} ${user.lastName}`}
                aria-haspopup="true"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: 'primary.dark', fontSize: 14 }}
                  aria-hidden
                >
                  {initials}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem divider />
              <MenuItem
                onClick={() => { navigate('/profile'); setAnchorEl(null); }}
              >
                <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} aria-hidden />
                Mon profil
              </MenuItem>
              <MenuItem
                onClick={() => { logout(); setAnchorEl(null); navigate('/clubs'); }}
              >
                Se déconnecter
              </MenuItem>
            </Menu>
          </>
        ) : (
          /* VISITOR: login button in top bar */
          <Stack direction="row" gap={1}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/login')}
              aria-label="Se connecter"
            >
              <LoginIcon />
            </IconButton>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
