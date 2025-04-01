import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ApartmentIcon from '@mui/icons-material/Apartment';

const servicos = [
  {
    icon: ArchitectureIcon,
    title: 'Projetos Arquitetônicos',
    description:
      'Desenvolvimento de projetos residenciais, comerciais e industriais com foco em funcionalidade e estética.',
  },
  {
    icon: HomeWorkIcon,
    title: 'Reformas e Adaptações',
    description:
      'Planejamento e execução de reformas, modernizações e adaptações de espaços existentes.',
  },
  {
    icon: SquareFootIcon,
    title: 'Laudos Técnicos',
    description:
      'Elaboração de laudos técnicos, vistorias e avaliações para diferentes finalidades.',
  },
  {
    icon: EngineeringIcon,
    title: 'Consultoria Técnica',
    description: 'Assessoria especializada em questões técnicas, normativas e regulamentares.',
  },
  {
    icon: DesignServicesIcon,
    title: 'Design de Interiores',
    description: 'Criação de ambientes personalizados com foco em conforto e funcionalidade.',
  },
  {
    icon: ApartmentIcon,
    title: 'Gestão de Obras',
    description: 'Acompanhamento e gerenciamento completo de obras e reformas.',
  },
];

const Servicos = () => {
  return (
    <div className="content-container">
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
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
            src="/images/bg1.jpg"
            alt="Background"
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
              backgroundColor: 'rgba(161, 111, 111, 0.5)',
            }}
          />
        </Box>

        {/* Conteúdo */}
        <Box
          sx={{
            pt: 12,
            px: { xs: 2, sm: 4, md: 6 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 300,
              letterSpacing: '0.2em',
              color: '#000',
            }}
          >
            Serviços
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {servicos.map((servico, index) => {
              const Icon = servico.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: 'rgba(161, 111, 111, 0.5)',
                      backdropFilter: 'blur(3px)',
                      border: '1px solid rgba(161, 111, 111, 0.2)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 4,
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
                        variant="body1"
                        sx={{
                          mb: 2,
                          fontWeight: 300,
                          letterSpacing: '0.1em',
                          color: '#fff',
                        }}
                      >
                        {servico.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 300,
                          color: '#fff',
                        }}
                      >
                        {servico.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Servicos;
