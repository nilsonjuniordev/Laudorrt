import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DescriptionIcon from '@mui/icons-material/Description';

const menuItems = [
  { text: 'Início', href: '/' },
  { text: 'Serviços', href: '/servicos' },
  { text: 'Projetos', href: '/projetos' },
  { text: 'Sobre', href: '/sobre' },
  { text: 'Contato', href: '/contato' },
  { text: 'Login', href: '/login' },
];

const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: PinterestIcon, href: 'https://pinterest.com', label: 'Pinterest' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: WhatsAppIcon, href: 'https://whatsapp.com', label: 'WhatsApp' },
];

export const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <Box component="nav">
      {/* Logo e Menu Hamburguer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: 3,
          zIndex: 1200,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo com blur background */}
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
            },
          }}
        >
          <Box
            onClick={() => handleNavigation('/')}
            sx={{
              width: 120,
              height: 40,
              position: 'relative',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.8,
              },
              zIndex: 1,
              display: 'block',
            }}
          >
            <Box
              component="img"
              src="/images/logo-m.png"
              alt="Logo"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>

        {/* Menu Hamburguer */}
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            color: '#DECBCB',
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(161, 111, 111, 0.3)',
            borderRadius: '50px',
            '&:hover': {
              backgroundColor: 'rgba(161, 111, 111, 0.8)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Redes Sociais Flutuantes */}
      <Stack
        spacing={2}
        sx={{
          position: 'fixed',
          right: 30,
          top: '78%',
          transform: 'translateY(-50%)',
          zIndex: 1200,
        }}
      >
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <IconButton
            key={label}
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#DECBCB',
              backdropFilter: 'blur(3px)',
              backgroundColor: 'rgba(161, 111, 111, 0.3)',
              borderRadius: '50px',
              '&:hover': {
                backgroundColor: 'rgba(161, 111, 111, 0.8)',
              },
            }}
          >
            <Icon />
          </IconButton>
        ))}
      </Stack>

      {/* Menu Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'rgba(161, 111, 111, 0.5)',
            backdropFilter: 'blur(8px)',
            boxShadow: 'none',
          },
        }}
      >
        <List sx={{ pt: 10 }}>
          {/* Botão Destacado para Laudos */}
          <ListItem sx={{ mb: 4, px: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<DescriptionIcon />}
              onClick={() => handleNavigation('/laudos')}
              sx={{
                backgroundColor: '#CBB271',
                color: '#000',
                padding: '12px 20px',
                fontSize: '1rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(203, 178, 113, 0.3)',
                '&:hover': {
                  backgroundColor: '#9e8c5a',
                },
              }}
            >
              Laudos RRT
            </Button>
          </ListItem>

          {menuItems.map(({ text, href }) => (
            <ListItem
              key={text}
              onClick={() => handleNavigation(href)}
              sx={{
                py: 2,
                color: '#DECBCB',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.5,
                },
              }}
            >
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    fontSize: '1.1rem',
                    color: '#DECBCB',
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
