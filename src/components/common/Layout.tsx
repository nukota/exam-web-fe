import { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Header } from '../admin/Header';
import { NavBar } from '../admin/NavBar';
import { useAuth } from '../../shared/providers/AuthProvider';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userRole = (currentUser?.role === 'admin' || currentUser?.role === 'teacher') ? 'admin' : 'student';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Permanent drawer for desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <NavBar role={userRole} />
        </Box>
      )}

      {/* Temporary drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <NavBar role={userRole} />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuClick={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef5 50%, #f0f4f8 100%)',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
