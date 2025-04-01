import React from 'react';
import { Box, Typography } from '@mui/material';

const HowItWorksSection: React.FC = () => {
  return (
    <Box id="form-steps" sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Como funciona?
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Processo simples e rápido em apenas 4 etapas
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 4,
          mt: 6,
        }}
      >
        {/* Etapa 1 */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              1
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Preencha o formulário
          </Typography>
          <Typography color="textSecondary">
            Forneça as informações básicas sobre seu projeto
          </Typography>
        </Box>

        {/* Etapa 2 */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              2
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Agendamento
          </Typography>
          <Typography color="textSecondary">Agende a vistoria técnica no local</Typography>
        </Box>

        {/* Etapa 3 */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              3
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Vistoria
          </Typography>
          <Typography color="textSecondary">Nosso arquiteto realiza a vistoria técnica</Typography>
        </Box>

        {/* Etapa 4 */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ color: 'white' }}>
              4
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Entrega
          </Typography>
          <Typography color="textSecondary">Receba seu laudo digital em até 24h</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorksSection;
