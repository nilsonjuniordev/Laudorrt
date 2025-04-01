import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const benefits = [
  {
    icon: VerifiedIcon,
    title: 'Profissionais Certificados',
    description: 'Equipe de arquitetos e engenheiros com registro no CAU/CREA',
  },
  {
    icon: SpeedIcon,
    title: 'Agilidade',
    description: 'Entrega do laudo em até 24 horas após a vistoria',
  },
  {
    icon: SecurityIcon,
    title: 'Segurança',
    description: 'Laudo com ART/RRT e todas as normas técnicas',
  },
];

const BenefitsSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Por que escolher nosso serviço?
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Oferecemos o melhor serviço com garantia de qualidade
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 48,
                      color: 'primary.main',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography color="textSecondary">{benefit.description}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default BenefitsSection;
