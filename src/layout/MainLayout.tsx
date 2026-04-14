import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppTopBar } from './AppTopBar';
import { SideDrawer, DRAWER_WIDTH } from './SideDrawer';
import { ChatbotWidget } from '@/features/chatbot/components/ChatbotWidget';
import { DevRoleSwitcher } from '@/components/DevRoleSwitcher';

export function MainLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppTopBar onMenuClick={() => setMobileOpen((o) => !o)} />

      {isDesktop ? (
        <SideDrawer open variant="permanent" onClose={() => {}} />
      ) : (
        <SideDrawer
          open={mobileOpen}
          variant="temporary"
          onClose={() => setMobileOpen(false)}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          minWidth: 0,
          ml: isDesktop ? `${DRAWER_WIDTH}px` : 0,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <ChatbotWidget />
      {import.meta.env.DEV && <DevRoleSwitcher />}
    </Box>
  );
}
