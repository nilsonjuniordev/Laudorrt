import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const contatoInfo = [
  {
    icon: LocationOnIcon,
    title: 'Endereço',
    content: 'Rua Nome da Rua, 123\nBairro - Cidade/UF\nCEP: 00000-000',
  },
  {
    icon: PhoneIcon,
    title: 'Telefone',
    content: '+55 (11) 99999-9999\n+55 (11) 99999-9999',
  },
  {
    icon: EmailIcon,
    title: 'E-mail',
    content: 'contato@laudorrt.com.br\ncomercial@laudorrt.com.br',
  },
];

const Contato = () => {
  return (
    <div className="content-container">
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Banner de fundo */}
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: '100vh',
            bottom: 0,
            zIndex: -1,
          }}
        >
          <Box
            component="img"
            src="/images/bg-c.jpg"
            alt="Banner"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(161, 111, 111, 0.8)',
              backdropFilter: 'blur(3px)',
            }}
          />
        </Box>

        {/* Conteúdo principal */}
        <Box
          sx={{
            pt: 12,
            pb: 20,
            px: { xs: 2, sm: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontWeight: 300,
              letterSpacing: '0.2em',
              color: '#000',
            }}
          >
            Contato
          </Typography>

          <Grid
            container
            spacing={6}
            maxWidth="lg"
            justifyContent="center"
            sx={{
              px: { xs: 2, md: 8 },
              mb: 12,
            }}
          >
            {contatoInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(161, 111, 111, 0.5)',
                      backdropFilter: 'blur(3px)',
                      border: '1px solid rgba(161, 111, 111, 0.2)',
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 48,
                        color: '#CBB271',
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: '#fff',
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {info.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        fontWeight: 300,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {info.content}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Contato;
