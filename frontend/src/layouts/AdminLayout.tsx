import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  useMediaQuery,
  Container,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import PrivateRoute from '../components/PrivateRoute';

const DRAWER_WIDTH = 240;

// Paleta de cores
const COLORS = {
  primary: '#A16F6F',
  secondary: '#CBB271',
  background: '#DECBCB',
  text: {
    primary: '#000000',
    secondary: '#545454',
  },
};

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({
  children,
  title = 'Painel Administrativo',
}: AdminLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/admin' },
    { text: 'Pedidos', icon: AssignmentIcon, path: '/admin/pedidos' },
    { text: 'Clientes', icon: PeopleIcon, path: '/admin/clientes' },
    //{ text: 'Configurações', icon: SettingsIcon, path: '/admin/configuracoes' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const drawer = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: COLORS.primary,
        }}
      >
        <Typography variant="h6" component="div" sx={{ color: '#fff' }}>
          {title}
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

      <List sx={{ bgcolor: COLORS.primary }}>
        {menuItems.map(item => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              router.push(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
              bgcolor: router.pathname === item.path ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
              color: '#fff',
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                style: { color: '#fff' },
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1, bgcolor: COLORS.primary }} />

      <List sx={{ bgcolor: COLORS.primary }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            },
            color: '#fff',
          }}
        >
          <ListItemIcon sx={{ color: '#fff' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            primaryTypographyProps={{
              style: { color: '#fff' },
            }}
          />
        </ListItem>
      </List>
    </>
  );

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.background }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            display: { md: 'none' },
            bgcolor: COLORS.primary,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
          {/* Drawer móvel */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                bgcolor: COLORS.primary,
                color: '#fff',
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Drawer permanente */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                bgcolor: COLORS.primary,
                color: '#fff',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: '100vh',
            bgcolor: COLORS.background,
            mt: { xs: 8, md: 0 },
          }}
        >
          <div className="main-content">{children}</div>
        </Box>
      </Box>
    </PrivateRoute>
  );
}
