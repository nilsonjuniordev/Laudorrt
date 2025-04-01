import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
// @ts-ignore
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import { api } from '../../src/services/api';

// Tipos
interface Atividade {
  tipo: string;
  tipo_projeto: string;
  tipo_execucao: string | null;
  valor_total: string;
  quantidade_metros_quadrados: string;
}

interface Pedido {
  id: string;
  tipo_pessoa: string;
  data_criacao: string;
  valor_total: string;
  status: string;
  categoria_imovel: string;
  tipo_imovel: string;
  tipo_laudo: string;
  atividades: Atividade[];
}

interface DashboardData {
  totalPedidos: number;
  pedidosPorStatus: {
    aguardando_pagamento: number;
    em_analise: number;
    aprovado: number;
    concluido: number;
    em_processo: number;
  };
  valoresPorStatus: {
    aguardando_pagamento: number;
    em_analise: number;
    aprovado: number;
    concluido: number;
    em_processo: number;
  };
  pedidosPorMes: Array<{
    mes: string;
    quantidade: number;
    valor: number;
  }>;
  pedidosPorTipo: Array<{
    id: string;
    value: number;
    label: string;
  }>;
  pedidosPorCategoria: Array<{
    id: string;
    value: number;
    label: string;
  }>;
  metrosQuadradosPorTipo: Array<{
    tipo: string;
    metros: number;
  }>;
}

// Componentes
const StatusCard = ({
  title,
  value,
  count,
  color,
}: {
  title: string;
  value: number;
  count: number;
  color: string;
}) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color }}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} pedidos
      </Typography>
    </Paper>
  </Grid>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS = {
  aguardando_pagamento: '#FF8042',
  concluido: '#26A69A',
  em_processo: '#AB47BC',
};

const STATUS_LABELS = {
  aguardando_pagamento: 'Aguardando Pagamento',
  concluido: 'Concluído',
  em_processo: 'Em Processo',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/pedidos');
        const pedidos: Pedido[] = response.data;

        const pedidosPorStatus = {
          aguardando_pagamento: 0,
          em_analise: 0,
          aprovado: 0,
          concluido: 0,
          em_processo: 0,
        };

        const valoresPorStatus = {
          aguardando_pagamento: 0,
          em_analise: 0,
          aprovado: 0,
          concluido: 0,
          em_processo: 0,
        };

        // Processamento dos dados
        pedidos.forEach(pedido => {
          pedidosPorStatus[pedido.status as keyof typeof pedidosPorStatus]++;
          valoresPorStatus[pedido.status as keyof typeof valoresPorStatus] += parseFloat(
            pedido.valor_total
          );
        });

        // Dados por categoria de imóvel
        const categorias = pedidos.reduce((acc: Record<string, number>, pedido) => {
          acc[pedido.categoria_imovel] = (acc[pedido.categoria_imovel] || 0) + 1;
          return acc;
        }, {});

        // Metros quadrados por tipo de atividade
        const metrosPorTipo = pedidos.reduce((acc: Record<string, number>, pedido) => {
          pedido.atividades.forEach(atividade => {
            // Verifica se é execução ou projeto
            const tipoAtividade = atividade.tipo_execucao ? 'Execução' : 'Projeto';
            const tipoServico = atividade.tipo_execucao || atividade.tipo_projeto;

            if (tipoServico && atividade.quantidade_metros_quadrados) {
              const chave = `${tipoAtividade} - ${tipoServico}`;
              const metros = parseFloat(atividade.quantidade_metros_quadrados) || 0;
              acc[chave] = (acc[chave] || 0) + metros;
            }
          });
          return acc;
        }, {});

        // Filtra e ordena os metros quadrados
        const metrosQuadradosOrdenados = Object.entries(metrosPorTipo)
          .filter(([_, valor]) => valor > 0) // Remove valores zerados
          .sort((a, b) => b[1] - a[1]) // Ordena do maior para o menor
          .map(([tipo, metros]) => ({
            tipo: tipo.replace(/(Execução|Projeto) - /, ''), // Remove o prefixo para melhor visualização
            metros: Math.round(metros * 100) / 100, // Arredonda para 2 casas decimais
          }));

        const stats: DashboardData = {
          totalPedidos: pedidos.length,
          pedidosPorStatus,
          valoresPorStatus,
          pedidosPorMes: processarPedidosPorMes(pedidos),
          pedidosPorTipo: Object.entries(
            pedidos.reduce((acc: Record<string, number>, p) => {
              acc[p.tipo_laudo] = (acc[p.tipo_laudo] || 0) + 1;
              return acc;
            }, {})
          ).map(([name, value]) => ({ id: name, label: name, value })),
          pedidosPorCategoria: Object.entries(categorias).map(([name, value]) => ({
            id: name,
            label: name,
            value,
          })),
          metrosQuadradosPorTipo: metrosQuadradosOrdenados,
        };

        setData(stats);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processarPedidosPorMes = (pedidos: Pedido[]) => {
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const dadosPorMes = Array.from({ length: 12 }, () => ({ quantidade: 0, valor: 0 }));

    pedidos.forEach(pedido => {
      const data = new Date(pedido.data_criacao);
      const mes = data.getMonth();
      dadosPorMes[mes].quantidade++;
      dadosPorMes[mes].valor += parseFloat(pedido.valor_total);
    });

    return meses.map((mes, index) => ({
      mes,
      quantidade: dadosPorMes[index].quantidade,
      valor: dadosPorMes[index].valor,
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Typography>Erro ao carregar dados</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Pedidos RRT
      </Typography>

      {/* Cards de Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Aguardando Pagamento */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {STATUS_LABELS.aguardando_pagamento}
            </Typography>
            <Typography variant="h4" sx={{ color: STATUS_COLORS.aguardando_pagamento }}>
              {data.valoresPorStatus.aguardando_pagamento.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.pedidosPorStatus.aguardando_pagamento} pedidos
            </Typography>
          </Paper>
        </Grid>

        {/* Em Processo */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {STATUS_LABELS.em_processo}
            </Typography>
            <Typography variant="h4" sx={{ color: STATUS_COLORS.em_processo }}>
              {data.valoresPorStatus.em_processo.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.pedidosPorStatus.em_processo} pedidos
            </Typography>
          </Paper>
        </Grid>

        {/* Concluído */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {STATUS_LABELS.concluido}
            </Typography>
            <Typography variant="h4" sx={{ color: STATUS_COLORS.concluido }}>
              {data.valoresPorStatus.concluido.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.pedidosPorStatus.concluido} pedidos
            </Typography>
          </Paper>
        </Grid>

        {/* Total de Pedidos */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total de Pedidos
            </Typography>
            <Typography variant="h4" sx={{ color: '#1976d2' }}>
              {(
                data.valoresPorStatus.aguardando_pagamento +
                data.valoresPorStatus.concluido +
                data.valoresPorStatus.em_processo
              ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.totalPedidos} pedidos
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Metros Quadrados por Tipo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Metros Quadrados por Tipo
            </Typography>
            {/* @ts-ignore */}
            <BarChart
              series={[
                {
                  data: data.metrosQuadradosPorTipo.map(d => d.metros),
                  label: 'Metros Quadrados',
                  color: '#8884d8',
                  valueFormatter: (value: number) => `${value.toLocaleString('pt-BR')} m²`,
                },
              ]}
              xAxis={[
                {
                  data: data.metrosQuadradosPorTipo.map(d => d.tipo),
                  scaleType: 'band',
                  tickLabelStyle: {
                    angle: 45,
                    textAnchor: 'start',
                    fontSize: 12,
                  },
                },
              ]}
              height={300}
              margin={{ left: 70, bottom: 70, right: 20, top: 20 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'top', horizontal: 'middle' },
                  padding: 0,
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Distribuição por Categoria */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Distribuição por Categoria de Imóvel
            </Typography>
            {/* @ts-ignore */}
            <PieChart
              series={[
                {
                  data: data.pedidosPorCategoria,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Evolução mensal */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Evolução Mensal
            </Typography>
            {/* @ts-ignore */}
            <LineChart
              series={[
                {
                  data: data.pedidosPorMes.map(d => d.quantidade),
                  label: 'Quantidade',
                  area: true,
                  color: '#8884d8',
                },
                {
                  data: data.pedidosPorMes.map(d => d.valor),
                  label: 'Valor (R$)',
                  area: true,
                  color: '#82ca9d',
                },
              ]}
              xAxis={[
                {
                  data: data.pedidosPorMes.map(d => d.mes),
                  scaleType: 'band',
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
