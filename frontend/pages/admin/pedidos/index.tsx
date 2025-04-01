import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { api } from '../../../src/services/api';
import { useRouter } from 'next/router';
import { TipoAtividade } from '../../../src/types';

interface Pedido {
  id: string;
  tipo_pessoa: string;
  data_criacao: string;
  data_atualizacao: string;
  nome_responsavel: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  site?: string;
  social_media?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  endereco_obra_igual: boolean;
  cep_obra?: string;
  logradouro_obra?: string;
  numero_obra?: string;
  complemento_obra?: string;
  bairro_obra?: string;
  cidade_obra?: string;
  estado_obra?: string;
  categoria_imovel: string;
  tipo_imovel: string;
  tipo_imovel_descricao?: string;
  tipo_laudo: string;
  valor_total: string;
  observacoes?: string;
  status: string;
  razao_social?: string;
  inscricao_estadual?: string;
  cpf_responsavel?: string;
  atividades: {
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
  }[];
  anexos: {
    id: string;
    pedido_id: string;
    atividade_id: string;
    data_upload: string;
    nome_original: string;
    nome_arquivo: string;
    tipo_arquivo: string;
    tamanho: string;
    tipo: string;
  }[];
  historico: {
    id: string;
    pedido_id: string;
    status_anterior: string;
    status_novo: string;
    observacao?: string;
    usuario_nome: string;
    data_alteracao: string;
  }[];
}

const statusMap = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: 'warning' },
  pago: { label: 'Pago', color: 'info' },
  em_processo: { label: 'Em Processo', color: 'primary' },
  concluido: { label: 'Concluído', color: 'success' },
  cancelado: { label: 'Cancelado', color: 'error' },
} as const;

export default function Pedidos() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchStatus = filtroStatus ? pedido.status === filtroStatus : true;
    const searchTerm = filtroBusca.toLowerCase();
    const matchBusca = filtroBusca
      ? pedido.nome_responsavel.toLowerCase().includes(searchTerm) ||
        pedido.cpf_cnpj.includes(searchTerm) ||
        pedido.email.toLowerCase().includes(searchTerm)
      : true;

    return matchStatus && matchBusca;
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor: string) => {
    return parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleDelete = async () => {
    if (!pedidoToDelete) return;

    try {
      await api.delete(`/pedidos/${pedidoToDelete}`);
      setPedidos(pedidos.filter(p => p.id !== pedidoToDelete));
      setDeleteDialogOpen(false);
      setPedidoToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  const handleDownloadPlanilha = async (pedidoId: string) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/planilha`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pedido-${pedidoId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar planilha:', error);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Pedidos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por nome, CPF/CNPJ ou email"
            value={filtroBusca}
            onChange={e => setFiltroBusca(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            label="Status"
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.entries(statusMap).map(([value, { label }]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pedidosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              pedidosFiltrados.map(pedido => (
                <TableRow key={pedido.id}>
                  <TableCell>{formatarData(pedido.data_criacao)}</TableCell>
                  <TableCell>{pedido.nome_responsavel}</TableCell>
                  <TableCell>{pedido.cpf_cnpj}</TableCell>
                  <TableCell>{pedido.tipo_laudo}</TableCell>
                  <TableCell>{formatarValor(pedido.valor_total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[pedido.status]?.label || pedido.status}
                      color={statusMap[pedido.status]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => router.push(`/admin/pedidos/${pedido.id}/visualizar`)}
                      size="small"
                      title="Visualizar"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => router.push(`/admin/pedidos/${pedido.id}`)}
                      size="small"
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDownloadPlanilha(pedido.id)}
                      size="small"
                      title="Baixar Planilha"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setPedidoToDelete(pedido.id);
                        setDeleteDialogOpen(true);
                      }}
                      size="small"
                      title="Excluir"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
