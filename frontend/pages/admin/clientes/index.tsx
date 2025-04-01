'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  TablePagination,
  Chip,
} from '@mui/material';
import { Visibility, WhatsApp } from '@mui/icons-material';
import { api } from '../../../src/services/api';
import { useRouter } from 'next/router';

interface Cliente {
  id: string;
  nome_responsavel: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  tipo_pessoa: string;
  razao_social?: string;
  total_pedidos: number;
  valor_total: number;
  ultimo_pedido: string;
}

export default function Clientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipoPessoaFilter, setTipoPessoaFilter] = useState('todos');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/pedidos');
        const pedidos = response.data;

        // Agrupa pedidos por cliente
        const clientesMap = pedidos.reduce((acc: Record<string, Cliente>, pedido: any) => {
          const clienteId = pedido.id;
          if (!acc[clienteId]) {
            acc[clienteId] = {
              id: pedido.id,
              nome_responsavel: pedido.nome_responsavel,
              cpf_cnpj: pedido.cpf_cnpj,
              email: pedido.email,
              telefone: pedido.telefone,
              tipo_pessoa: pedido.tipo_pessoa,
              razao_social: pedido.razao_social,
              total_pedidos: 0,
              valor_total: 0,
              ultimo_pedido: pedido.data_criacao,
            };
          }
          acc[clienteId].total_pedidos++;
          acc[clienteId].valor_total += parseFloat(pedido.valor_total);
          acc[clienteId].ultimo_pedido =
            new Date(pedido.data_criacao) > new Date(acc[clienteId].ultimo_pedido)
              ? pedido.data_criacao
              : acc[clienteId].ultimo_pedido;
          return acc;
        }, {});

        const clientesList = Object.values(clientesMap) as Cliente[];
        setClientes(clientesList);
        setFilteredClientes(clientesList);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    let filtered = [...clientes];

    // Filtro por tipo de pessoa
    if (tipoPessoaFilter !== 'todos') {
      filtered = filtered.filter(cliente => cliente.tipo_pessoa === tipoPessoaFilter);
    }

    // Filtro por pesquisa
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        cliente =>
          cliente.nome_responsavel.toLowerCase().includes(searchLower) ||
          cliente.cpf_cnpj.toLowerCase().includes(searchLower) ||
          cliente.email.toLowerCase().includes(searchLower) ||
          (cliente.razao_social && cliente.razao_social.toLowerCase().includes(searchLower))
      );
    }

    setFilteredClientes(filtered);
    setPage(0);
  }, [search, tipoPessoaFilter, clientes]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarTelefone = (telefone: string) => {
    return telefone
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2');
  };

  const abrirWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numero}`, '_blank');
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f0f0f0' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Clientes
      </Typography>

      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pesquisar"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nome, CPF/CNPJ, E-mail ou Razão Social"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Tipo de Pessoa"
            value={tipoPessoaFilter}
            onChange={e => setTipoPessoaFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="fisica">Pessoa Física</MenuItem>
            <MenuItem value="juridica">Pessoa Jurídica</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="center">Total Pedidos</TableCell>
              <TableCell align="right">Valor Total</TableCell>
              <TableCell>Último Pedido</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClientes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(cliente => (
                <TableRow key={cliente.id} hover>
                  <TableCell>
                    {cliente.tipo_pessoa === 'juridica' ? (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {cliente.razao_social}
                        </Typography>
                        <Typography variant="body2">{cliente.nome_responsavel}</Typography>
                      </>
                    ) : (
                      cliente.nome_responsavel
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      color={cliente.tipo_pessoa === 'fisica' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{cliente.cpf_cnpj}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{formatarTelefone(cliente.telefone)}</TableCell>
                  <TableCell align="center">{cliente.total_pedidos}</TableCell>
                  <TableCell align="right">
                    {cliente.valor_total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell>{formatarData(cliente.ultimo_pedido)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalhes">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="WhatsApp">
                      <IconButton
                        size="small"
                        onClick={() => abrirWhatsApp(cliente.telefone)}
                        color="success"
                      >
                        <WhatsApp />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredClientes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>
    </Box>
  );
}
