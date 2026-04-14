/**
 * PublicLayout — layout minimal pour visiteurs non authentifiés.
 * Barre supérieure avec logo + boutons Connexion/Inscription.
 */
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChatbotWidget } from '@/features/chatbot/components/ChatbotWidget';
import { DevRoleSwitcher } from '@/components/DevRoleSwitcher';

const PUBLIC_NAV = [
  { label: 'Clubs', path: '/clubs' },
  { label: 'Événements', path: '/events' },
];

export function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="primary" aria-label="Barre publique">
        <Toolbar>
          {/* Logo */}
          <Stack direction="row" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
            <SchoolIcon aria-hidden />
            <Typography variant="h6" fontWeight={700} component={Link} to="/clubs"
              sx={{ color: 'inherit', textDecoration: 'none' }}>
              UniClubs
            </Typography>
          </Stack>

          {/* Nav links */}
          <Stack direction="row" gap={1} mr={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {PUBLIC_NAV.map((n) => (
              <Button
                key={n.path}
                color="inherit"
                onClick={() => navigate(n.path)}
                sx={{
                  fontWeight: location.pathname.startsWith(n.path) ? 700 : 400,
                  borderBottom: location.pathname.startsWith(n.path)
                    ? '2px solid white'
                    : 'none',
                  borderRadius: 0,
                }}
              >
                {n.label}
              </Button>
            ))}
          </Stack>

          {/* Auth buttons */}
          <Stack direction="row" gap={1}>
            <Button
              color="inherit"
              variant="outlined"
              size="small"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              aria-label="Se connecter"
              sx={{ borderColor: 'rgba(255,255,255,0.6)' }}
            >
              Connexion
            </Button>
            <Button
              color="inherit"
              variant="contained"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/register')}
              aria-label="Créer un compte"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              S'inscrire
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Chatbot available for visitors too */}
      <ChatbotWidget />
      <DevRoleSwitcher />
    </Box>
  );
}
