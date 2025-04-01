import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(161, 111, 111, 0.3)',
        color: '#DECBCB',
        py: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" sx={{ textAlign: 'center', color: '#DECBCB' }}>
        © {new Date().getFullYear()} Laudo RRT. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
