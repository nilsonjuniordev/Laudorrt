import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const Sobre = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 12,
        px: { xs: 2, sm: 4, md: 6 },
        backgroundColor: 'transparent',
      }}
    >
      <Grid
        container
        spacing={6}
        sx={{
          minHeight: 'calc(100vh - 100px)',
          alignItems: 'center',
        }}
      >
        {/* Imagem - 40% */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '300px', md: '600px' },
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src="/images/escritorio.jpg"
              alt="Nosso Escritório"
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
        </Grid>

        {/* Conteúdo - 60% */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              p: { xs: 2, md: 6 },
              backdropFilter: 'blur(8px)',
              backgroundColor: '#545454',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 300,
                letterSpacing: '0.2em',
                mb: 4,
              }}
            >
              Sobre Nós
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#CBB271',
                fontWeight: 300,
                mb: 3,
                letterSpacing: '0.1em',
              }}
            >
              Excelência em Arquitetura e Design
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              Com mais de uma década de experiência no mercado, nossa empresa se destaca pela
              excelência em projetos arquitetônicos e design de interiores. Nossa equipe é formada
              por profissionais altamente qualificados e apaixonados por transformar sonhos em
              realidade.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'white',
                mb: 3,
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              Nosso compromisso é criar espaços que não apenas atendam às necessidades funcionais,
              mas também proporcionem experiências únicas e memoráveis. Trabalhamos com atenção aos
              detalhes e dedicação para superar as expectativas de nossos clientes.
            </Typography>

            <Box
              sx={{
                mt: 6,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 4,
              }}
            >
              <Box>
                <Typography variant="h3" sx={{ color: '#CBB271', fontWeight: 300, mb: 1 }}>
                  500+
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Projetos Realizados
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ color: '#CBB271', fontWeight: 300, mb: 1 }}>
                  15+
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Anos de Experiência
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ color: '#CBB271', fontWeight: 300, mb: 1 }}>
                  100%
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Clientes Satisfeitos
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sobre;
