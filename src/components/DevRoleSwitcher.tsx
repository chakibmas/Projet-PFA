/**
 * DevRoleSwitcher — only visible in DEV mode.
 * Floating panel (bottom-left) to instantly switch between user personas.
 */
import {
  Avatar,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DEV_PERSONAS, switchDevPersona } from '@/mocks/devSwitch';

const ICONS: Record<string, React.ReactNode> = {
  PLATFORM_ADMIN: <AdminPanelSettingsIcon fontSize="small" />,
  CLUB_ADMIN: <ManageAccountsIcon fontSize="small" />,
  MEMBER: <PersonIcon fontSize="small" />,
  VISITOR: <VisibilityIcon fontSize="small" />,
};

const COLORS: Record<string, string> = {
  PLATFORM_ADMIN: '#1565C0',
  CLUB_ADMIN: '#2E7D32',
  MEMBER: '#6A1B9A',
  VISITOR: '#BF360C',
};

export function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null;

  const currentToken = localStorage.getItem('access_token') ?? '';

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 16,
        zIndex: 9999,
        p: 1.5,
        borderRadius: 3,
        minWidth: 200,
        border: '2px dashed',
        borderColor: 'warning.main',
      }}
      aria-label="Sélecteur de rôle (dev)"
    >
      <Stack direction="row" alignItems="center" gap={1} mb={1}>
        <AccountCircleIcon fontSize="small" color="warning" />
        <Typography variant="caption" fontWeight={700} color="warning.main">
          DEV — Changer de rôle
        </Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <Stack gap={0.5}>
        {DEV_PERSONAS.map((p) => {
          const active = currentToken === `mock-token-${p.id}` || (p.id === 'visitor' && !currentToken);
          return (
            <Tooltip key={p.id} title={p.email ?? 'Accès visiteur'} placement="right">
              <Chip
                icon={<>{ICONS[p.role]}</>}
                label={
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <span>{p.name}</span>
                    <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>
                      {p.role}
                    </Typography>
                  </Stack>
                }
                size="small"
                onClick={() => switchDevPersona(p.id)}
                variant={active ? 'filled' : 'outlined'}
                sx={{
                  justifyContent: 'flex-start',
                  cursor: 'pointer',
                  bgcolor: active ? COLORS[p.role] : undefined,
                  color: active ? 'white' : undefined,
                  '& .MuiChip-icon': { color: active ? 'white' : COLORS[p.role] },
                  fontWeight: active ? 700 : 400,
                }}
                avatar={
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: COLORS[p.role],
                      color: 'white',
                    }}
                  >
                    {p.name[0]}
                  </Avatar>
                }
              />
            </Tooltip>
          );
        })}
      </Stack>
    </Paper>
  );
}
