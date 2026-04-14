import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import FolderIcon from '@mui/icons-material/Folder';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/shared/types/auth.types';

export const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  PLATFORM_ADMIN: { label: 'Admin Plateforme', color: '#1565C0' },
  CLUB_ADMIN:     { label: 'Admin Club',       color: '#2E7D32' },
  MEMBER:         { label: 'Membre',           color: '#6A1B9A' },
  VISITOR:        { label: 'Visiteur',         color: '#BF360C' },
};

// ═══════════════════════════════════════════════════════════════════════════
//  Navigation par rôle — chaque rôle voit UNIQUEMENT ses rubriques
// ═══════════════════════════════════════════════════════════════════════════

function visitorNav(): NavSection[] {
  return [
    {
      title: 'Découvrir',
      items: [
        { label: 'Clubs',        path: '/clubs',    icon: <GroupsIcon /> },
        { label: 'Événements',   path: '/events',   icon: <EventIcon /> },
      ],
    },
    {
      title: 'Compte',
      items: [
        { label: 'Se connecter', path: '/login',    icon: <LoginIcon /> },
        { label: "S'inscrire",   path: '/register', icon: <PersonAddIcon /> },
      ],
    },
  ];
}

function memberNav(): NavSection[] {
  return [
    {
      title: 'Mon espace',
      items: [
        { label: 'Tableau de bord',    path: '/member/dashboard', icon: <DashboardIcon /> },
        { label: 'Notifications',      path: '/notifications',    icon: <NotificationsIcon /> },
      ],
    },
    {
      title: 'Clubs & Adhésions',
      items: [
        { label: 'Parcourir les clubs', path: '/clubs',         icon: <GroupsIcon /> },
        { label: 'Mes adhésions',       path: '/memberships',   icon: <HowToRegIcon /> },
      ],
    },
    {
      title: 'Événements',
      items: [
        { label: 'Tous les événements', path: '/events',           icon: <EventIcon /> },
        { label: 'Mes inscriptions',    path: '/my-registrations', icon: <EventAvailableIcon /> },
      ],
    },
    {
      title: 'Informations',
      items: [
        { label: 'Annonces',  path: '/announcements', icon: <CampaignIcon /> },
        { label: 'Documents', path: '/documents',     icon: <FolderIcon /> },
      ],
    },
  ];
}

function clubAdminNav(clubId: string): NavSection[] {
  return [
    {
      title: 'Tableau de bord',
      items: [
        { label: 'Mon tableau de bord', path: '/club-admin/dashboard', icon: <DashboardIcon /> },
        { label: 'Notifications',       path: '/notifications',        icon: <NotificationsIcon /> },
      ],
    },
    {
      title: 'Gestion du club',
      items: [
        { label: 'Fiche du club',         path: `/clubs/${clubId}`,             icon: <GroupsIcon /> },
        { label: 'Modifier le club',      path: `/clubs/${clubId}/edit`,        icon: <AddCircleIcon /> },
        { label: 'Membres',               path: `/clubs/${clubId}/members`,     icon: <PeopleIcon /> },
        { label: 'Adhésions en attente',   path: `/clubs/${clubId}/memberships`, icon: <PendingActionsIcon /> },
        { label: 'Statistiques du club',   path: `/clubs/${clubId}/stats`,       icon: <BarChartIcon /> },
      ],
    },
    {
      title: 'Événements',
      items: [
        { label: 'Tous les événements', path: '/events',     icon: <EventIcon /> },
        { label: 'Créer un événement',  path: '/events/new', icon: <AddCircleIcon /> },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Annonces',  path: '/announcements', icon: <CampaignIcon /> },
        { label: 'Documents', path: '/documents',     icon: <FolderIcon /> },
      ],
    },
  ];
}

function platformAdminNav(): NavSection[] {
  return [
    {
      title: 'Administration',
      items: [
        { label: 'Tableau de bord',  path: '/admin/dashboard',       icon: <DashboardIcon /> },
        { label: 'Valider les clubs', path: '/admin/validate-clubs', icon: <VerifiedIcon /> },
        { label: 'Utilisateurs',     path: '/admin/users',           icon: <PeopleIcon /> },
        { label: 'Modérer chatbot',  path: '/admin/chatbot',         icon: <SmartToyIcon /> },
      ],
    },
    {
      title: 'Consulter',
      items: [
        { label: 'Clubs',       path: '/clubs',         icon: <GroupsIcon /> },
        { label: 'Événements',  path: '/events',        icon: <EventIcon /> },
        { label: 'Annonces',    path: '/announcements', icon: <CampaignIcon /> },
        { label: 'Documents',   path: '/documents',     icon: <FolderIcon /> },
      ],
    },
    {
      title: 'Mon espace',
      items: [
        { label: 'Notifications', path: '/notifications', icon: <NotificationsIcon /> },
        { label: 'Mes adhésions', path: '/memberships',   icon: <HowToRegIcon /> },
      ],
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════

interface Props {
  open: boolean;
  onClose: () => void;
  variant: 'temporary' | 'permanent' | 'persistent';
}

export function SideDrawer({ open, onClose, variant }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const role: UserRole = isAuthenticated && user ? user.role : 'VISITOR';
  const meta = ROLE_META[role];

  // Pick sections for this role
  let sections: NavSection[];
  switch (role) {
    case 'PLATFORM_ADMIN':
      sections = platformAdminNav();
      break;
    case 'CLUB_ADMIN':
      sections = clubAdminNav(user?.clubId ?? '');
      break;
    case 'MEMBER':
      sections = memberNav();
      break;
    default:
      sections = visitorNav();
  }

  const handleNav = (path: string) => {
    navigate(path);
    if (variant === 'temporary') onClose();
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
      aria-label="Menu latéral"
    >
      <Toolbar />

      {/* Role badge */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Chip
          label={meta.label}
          size="small"
          sx={{ bgcolor: meta.color, color: 'white', fontWeight: 700, fontSize: '0.7rem', width: '100%' }}
        />
        {isAuthenticated && user && (
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5} textAlign="center">
            {user.firstName} {user.lastName}
          </Typography>
        )}
      </Box>

      <Divider />

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {sections.map((section, si) => (
          <Box key={si}>
            {section.title && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}
              >
                {section.title}
              </Typography>
            )}
            <List dense disablePadding>
              {section.items.map((item) => {
                const active = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      selected={active}
                      onClick={() => handleNav(item.path)}
                      aria-label={item.label}
                      aria-current={active ? 'page' : undefined}
                      sx={{
                        mx: 1,
                        borderRadius: 1,
                        '&.Mui-selected': {
                          bgcolor: `${meta.color}18`,
                          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                            color: meta.color,
                            fontWeight: 700,
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: active ? meta.color : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.85rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {si < sections.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
