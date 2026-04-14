import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/auth.types';

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
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';
  const roleMeta = ROLE_META[user?.role ?? 'VISITOR'];

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
              <IconButton color="inherit" aria-label="Notifications" sx={{ mr: 1 }}>
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

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
