import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import PedidoService from '../src/services/PedidoService';
import { formatarMoeda } from '../src/utils/format';
import { TipoAtividade } from '../src/types';

interface Pedido {
  id: string;
  valor_total: number;
  status: string;
  atividades: Array<{
    tipo: string;
    valor_total: number;
  }>;
}

interface Atividade {
  id: string;
  pedido_id: string;
  data_criacao: string;
  tipo: TipoAtividade;
  tipo_projeto?: string;
  tipo_execucao?: string;
  quantidade_metros_quadrados: string;
  descricao_servico: string;
  precisa_art: boolean;
  precisa_memorial: boolean;
  precisa_projeto: boolean;
  precisa_execucao: boolean;
  valor_unitario: string;
  valor_total: string;
}

export default function ObrigadoPage() {
  const router = useRouter();
  const { pedido_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [qrCodeData, setQrCodeData] = useState<any>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!pedido_id) return;

      try {
        const response = await PedidoService.buscarPorId(pedido_id as string);
        console.log('Resposta da API:', response);
        if (response.pedido) {
          setPedido(response.pedido);
          setQrCodeData(response.qr_code_pix);
          console.log('QR Code Data:', response.qr_code_pix);
        } else {
          setError('Pedido não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do pedido');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [pedido_id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box py={8} textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Erro
          </Typography>
          <Typography>{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/')}
            sx={{ mt: 4 }}
          >
            Voltar para o início
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={8}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary" align="center">
            Obrigado pelo seu pedido!
          </Typography>

          <Typography variant="body1" paragraph align="center">
            Seu pedido foi recebido com sucesso. Para finalizar, realize o pagamento através do QR
            Code PIX abaixo.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Resumo do Pedido */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                >
                  <span>Número do Pedido:</span>
                  <span>{pedido?.id}</span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                >
                  <span>Status:</span>
                  <span>{pedido?.status}</span>
                </Typography>

                <Divider sx={{ my: 2 }} />

                {pedido?.atividades?.map((atividade, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                  >
                    <span>
                      Atividade {index + 1} - {atividade.tipo}:
                    </span>
                    <span>{formatarMoeda(atividade.valor_total || 0)}</span>
                  </Typography>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="h6"
                  sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                >
                  <span>Total:</span>
                  <span>{formatarMoeda(pedido?.valor_total || 0)}</span>
                </Typography>
              </Box>
            </Grid>

            {/* QR Code PIX */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Pagamento via PIX
              </Typography>

              {qrCodeData ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      padding: 2,
                      borderRadius: 1,
                      display: 'inline-block',
                      marginBottom: 2,
                    }}
                  >
                    <img
                      src={qrCodeData.qrcode}
                      alt="QR Code PIX"
                      style={{ width: 200, height: 200 }}
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Valor: {formatarMoeda(Number(qrCodeData.valor))}
                  </Typography>

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(qrCodeData.payload);
                      alert('Código PIX copiado!');
                    }}
                    sx={{ mt: 1 }}
                  >
                    Copiar código PIX
                  </Button>
                </Box>
              ) : (
                <Typography color="error">
                  Não foi possível gerar o QR Code PIX. Por favor, tente novamente.
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => router.push('/')}>
              Voltar para o início
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
