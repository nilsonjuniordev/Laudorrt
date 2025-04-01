import React from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import BenefitsSection from '../src/components/BenefitsSection';
import HowItWorksSection from '../src/components/HowItWorksSection';
import Link from 'next/link';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqItems = [
  {
    question: 'O que é RRT?',
    answer:
      'O RRT (Registro de Responsabilidade Técnica) é o documento equivalente à ART, específico para serviços de arquitetura. Ele garante a conformidade com a NBR 16280 e registra oficialmente a responsabilidade técnica do arquiteto pelo projeto ou execução.',
  },
  {
    question: 'Qual a diferença entre ART e RRT?',
    answer:
      'A principal diferença está no profissional e conselho emissor: a ART é emitida por Engenheiros junto ao CREA (Conselho Regional de Engenharia e Agronomia), enquanto a RRT é emitida por Arquitetos junto ao CAU (Conselho de Arquitetura e Urbanismo).',
  },
  {
    question: 'O que inclui o Laudo Técnico?',
    answer:
      'O Laudo Técnico é um documento detalhado que inclui a descrição completa dos serviços, plantas com as alterações propostas, especificações técnicas e orientações para a execução adequada do projeto, garantindo a segurança e qualidade da obra.',
  },
  {
    question: 'É obrigatório ter ART ou RRT para reforma?',
    answer:
      'Sim, é obrigatório. A NBR 16280, estabelecida em 2014, exige que qualquer modificação em apartamentos ou residências tenha uma ART ou RRT, garantindo a segurança individual e coletiva através da supervisão profissional.',
  },
  {
    question: 'Qual a validade destes documentos?',
    answer:
      'Tanto a ART quanto a RRT são documentos vitalícios, não possuindo data de validade. No entanto, durante sua emissão, são especificadas as datas de início e conclusão das atividades previstas.',
  },
  {
    question: 'Quais são os custos envolvidos?',
    answer:
      'Em 2023, a taxa do CREA para ART é R$ 96,62, e a taxa do CAU para RRT é R$ 115,18. O valor do laudo técnico varia entre R$ 147,00 e R$ 797,00, dependendo da complexidade do projeto, mais a taxa correspondente.',
  },
  {
    question: 'Como posso pagar?',
    answer:
      'Oferecemos pagamento via PIX ou cartão de crédito, com possibilidade de parcelamento em até 3x sem juros para sua conveniência.',
  },
];

const Laudos = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Banner Principal */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Imagem de Fundo */}
        <Box
          component="img"
          src="/images/bg1.jpg"
          alt="Banner Laudos"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(161, 111, 111, 0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: -1,
          }}
        />

        {/* Conteúdo do Banner */}
        <Box
          sx={{
            maxWidth: '800px',
            padding: { xs: 3, md: 6 },
            color: 'white',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 300,
              letterSpacing: '0.2em',
              mb: 4,
              color: '#fff',
            }}
          >
            Laudos RRT
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 300,
              mb: 4,
              color: '#fff',
              lineHeight: 1.6,
            }}
          >
            Garanta a segurança e legalidade da sua obra com nossa documentação técnica
            profissional. Emitimos laudos com RRT por profissionais registrados e experientes.
          </Typography>

          <Link href="/checkout" passHref>
            <Button
              variant="contained"
              size="large"
              startIcon={<DescriptionIcon />}
              sx={{
                backgroundColor: '#CBB271',
                color: '#000',
                padding: '15px 40px',
                letterSpacing: '0.1em',
                border: '1px solid rgba(203, 178, 113, 0.3)',
                '&:hover': {
                  backgroundColor: '#9e8c5a',
                },
                mt: 4,
              }}
            >
              Solicite seu laudo agora
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Seção Como Funciona */}
      <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        <HowItWorksSection />
      </Box>

      {/* Seção de Benefícios */}
      <Box sx={{ backgroundColor: 'rgba(161, 111, 111, 0.1)' }}>
        <BenefitsSection />
      </Box>

      {/* Seção de Perguntas Frequentes */}
      <Box
        sx={{
          py: 8,
          px: { xs: 2, md: 6 },
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
          Dúvidas Frequentes
        </Typography>

        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: 'rgba(161, 111, 111, 0.1)',
                backdropFilter: 'blur(3px)',
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#CBB271' }} />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(161, 111, 111, 0.2)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: '#000',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  sx={{
                    color: '#000',
                    lineHeight: 1.6,
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Laudos;
