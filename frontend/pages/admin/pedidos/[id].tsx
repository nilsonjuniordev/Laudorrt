import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../src/hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../../src/services/api';
import { formatarMoeda } from '../../../src/utils/format';
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
  historico?: {
    status_anterior: string;
    status_novo: string;
    observacao: string;
    usuario_nome: string;
    data_alteracao: string;
  }[];
}

const tiposPessoa = [
  { value: 'fisica', label: 'Pessoa Física' },
  { value: 'juridica', label: 'Pessoa Jurídica' },
];

const categoriasImovel = ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'RURAL', 'MISTO'];

const tiposImovel = {
  RESIDENCIAL: ['CASA', 'APARTAMENTO', 'SOBRADO', 'KITNET', 'OUTRO'],
  COMERCIAL: ['LOJA', 'SALA COMERCIAL', 'GALPÃO', 'OUTRO'],
  INDUSTRIAL: ['GALPÃO INDUSTRIAL', 'FÁBRICA', 'OUTRO'],
  RURAL: ['FAZENDA', 'SÍTIO', 'CHÁCARA', 'OUTRO'],
  MISTO: ['RESIDENCIAL/COMERCIAL', 'OUTRO'],
};

const tiposLaudo = ['ART', 'RRT'];

const tiposAtividade = ['PROJETO', 'EXECUCAO'];

const tiposProjeto = [
  'LEVANTAMENTO ARQUITETÔNICO',
  'PROJETO ARQUITETÔNICO',
  'PROJETO DE INTERIORES',
  'PROJETO DE REFORMA',
  'PROJETO DE REGULARIZAÇÃO',
  'OUTRO',
];

const tiposExecucao = [
  'EXECUÇÃO DE OBRA',
  'EXECUÇÃO DE REFORMA',
  'EXECUÇÃO DE INSTALAÇÃO DE REVESTIMENTOS CERÂMICOS',
  'EXECUÇÃO DE INSTALAÇÃO DE PORCELANATO',
  'EXECUÇÃO DE PINTURA',
  'OUTRO',
];

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const statusMap = {
  aguardando_pagamento: { label: 'Aguardando Pagamento', color: 'warning' },
  pago: { label: 'Pago', color: 'info' },
  em_processo: { label: 'Em Processo', color: 'primary' },
  concluido: { label: 'Concluído', color: 'success' },
  cancelado: { label: 'Cancelado', color: 'error' },
} as const;

export default function EditarPedido() {
  useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { getUser } = useAuth();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [novoStatus, setNovoStatus] = useState('');
  const [observacaoStatus, setObservacaoStatus] = useState('');

  useEffect(() => {
    console.log('ID do pedido mudou:', id);
    if (id && typeof id === 'string') {
      fetchPedido();
    }
  }, [id]);

  const fetchPedido = async () => {
    try {
      setLoading(true);
      console.log('Buscando pedido com ID:', id);
      const response = await api.get(`/pedidos/${id}`);
      console.log('Resposta completa da API:', response);
      console.log('Dados do pedido:', response.data);

      if (!response.data) {
        console.error('Dados do pedido não encontrados');
        return;
      }

      // Extrair os dados do pedido da resposta
      const { pedido: pedidoData, atividades, anexos, historico } = response.data;

      // Combinar os dados em um único objeto
      const pedidoCompleto = {
        ...pedidoData,
        atividades: atividades || [],
        anexos: anexos || [],
        historico: historico || [],
      };

      console.log('Pedido completo montado:', pedidoCompleto);
      setPedido(pedidoCompleto);
    } catch (error) {
      console.error('Erro detalhado ao buscar pedido:', error);
      if (error.response) {
        console.error('Status do erro:', error.response.status);
        console.error('Dados do erro:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!pedido) return;

    setPedido({
      ...pedido,
      [field]: value,
    });
  };

  const handleAtividadeChange = (index: number, field: string, value: any) => {
    if (!pedido) return;

    const newAtividades = [...pedido.atividades];
    newAtividades[index] = {
      ...newAtividades[index],
      [field]: value,
    };

    setPedido({
      ...pedido,
      atividades: newAtividades,
    });
  };

  const handleAddAtividade = () => {
    if (!pedido) return;

    const novaAtividade = {
      id: `temp_${Date.now()}`,
      pedido_id: pedido.id,
      data_criacao: new Date().toISOString(),
      tipo: 'PROJETO' as TipoAtividade,
      quantidade_metros_quadrados: '0',
      descricao_servico: '',
      precisa_art: false,
      precisa_memorial: false,
      precisa_projeto: false,
      precisa_execucao: false,
      valor_unitario: '0',
      valor_total: '0',
    };

    setPedido({
      ...pedido,
      atividades: [...pedido.atividades, novaAtividade],
    });
  };

  const handleRemoveAtividade = (index: number) => {
    if (!pedido) return;

    const newAtividades = [...pedido.atividades];
    newAtividades.splice(index, 1);

    setPedido({
      ...pedido,
      atividades: newAtividades,
    });
  };

  const handleSave = async () => {
    if (!pedido) return;

    try {
      setSaving(true);
      await api.put(`/pedidos/${id}`, pedido);
      router.push('/admin/pedidos');
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/pedidos/${id}`);
      router.push('/admin/pedidos');
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  const handleRemoveAnexo = async (anexoId: string) => {
    try {
      await api.delete(`/pedidos/${id}/anexos/${anexoId}`);
      fetchPedido();
    } catch (error) {
      console.error('Erro ao remover anexo:', error);
    }
  };

  const handleChangeStatus = async () => {
    if (!pedido || !novoStatus) return;

    try {
      setSaving(true);
      const usuario = getUser();

      // Enviar atualização de status
      await api.put(`/pedidos/${id}/status`, {
        status: novoStatus,
        observacao: observacaoStatus,
        usuario_nome: usuario?.nome || 'Administrador',
      });

      // Buscar pedido atualizado
      await fetchPedido();

      setStatusDialogOpen(false);
      setNovoStatus('');
      setObservacaoStatus('');
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !pedido) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">
            Editar Pedido #{pedido?.id ? pedido.id.slice(0, 8) : ''}
          </Typography>
          <Chip
            label={statusMap[pedido?.status as keyof typeof statusMap]?.label || pedido?.status}
            color={statusMap[pedido?.status as keyof typeof statusMap]?.color || 'default'}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setStatusDialogOpen(true)}>
            Alterar Status
          </Button>
          <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
            Excluir
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Salvar
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Informações do Cliente */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações do Cliente
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Pessoa</InputLabel>
                  <Select
                    value={pedido.tipo_pessoa}
                    onChange={e => handleChange('tipo_pessoa', e.target.value)}
                    label="Tipo de Pessoa"
                  >
                    {tiposPessoa.map(tipo => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {pedido.tipo_pessoa === 'juridica' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Razão Social"
                      value={pedido.razao_social || ''}
                      onChange={e => handleChange('razao_social', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Inscrição Estadual"
                      value={pedido.inscricao_estadual || ''}
                      onChange={e => handleChange('inscricao_estadual', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CNPJ"
                      value={pedido.cpf_cnpj || ''}
                      onChange={e => handleChange('cpf_cnpj', e.target.value)}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Responsável"
                  value={pedido.nome_responsavel}
                  onChange={e => handleChange('nome_responsavel', e.target.value)}
                />
              </Grid>

              {pedido.tipo_pessoa === 'fisica' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={pedido.cpf_cnpj || ''}
                    onChange={e => handleChange('cpf_cnpj', e.target.value)}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={pedido.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={pedido.telefone}
                  onChange={e => handleChange('telefone', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Site"
                  value={pedido.site || ''}
                  onChange={e => handleChange('site', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Redes Sociais"
                  value={pedido.social_media || ''}
                  onChange={e => handleChange('social_media', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Endereço */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Endereço
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={pedido.cep}
                  onChange={e => handleChange('cep', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Logradouro"
                  value={pedido.logradouro}
                  onChange={e => handleChange('logradouro', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Número"
                  value={pedido.numero}
                  onChange={e => handleChange('numero', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Complemento"
                  value={pedido.complemento || ''}
                  onChange={e => handleChange('complemento', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bairro"
                  value={pedido.bairro}
                  onChange={e => handleChange('bairro', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={pedido.cidade}
                  onChange={e => handleChange('cidade', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={pedido.estado}
                  onChange={e => handleChange('estado', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Endereço da Obra */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Endereço da Obra</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={pedido.endereco_obra_igual}
                    onChange={e => handleChange('endereco_obra_igual', e.target.checked)}
                  />
                }
                label="Mesmo endereço do cliente"
              />
            </Box>

            {!pedido.endereco_obra_igual && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={pedido.cep_obra || ''}
                    onChange={e => handleChange('cep_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Logradouro"
                    value={pedido.logradouro_obra || ''}
                    onChange={e => handleChange('logradouro_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={pedido.numero_obra || ''}
                    onChange={e => handleChange('numero_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    value={pedido.complemento_obra || ''}
                    onChange={e => handleChange('complemento_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={pedido.bairro_obra || ''}
                    onChange={e => handleChange('bairro_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={pedido.cidade_obra || ''}
                    onChange={e => handleChange('cidade_obra', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={pedido.estado_obra || ''}
                    onChange={e => handleChange('estado_obra', e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Informações do Imóvel */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações do Imóvel
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria do Imóvel</InputLabel>
                  <Select
                    value={pedido.categoria_imovel}
                    onChange={e => handleChange('categoria_imovel', e.target.value)}
                    label="Categoria do Imóvel"
                  >
                    {categoriasImovel.map(categoria => (
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo do Imóvel</InputLabel>
                  <Select
                    value={pedido.tipo_imovel}
                    onChange={e => handleChange('tipo_imovel', e.target.value)}
                    label="Tipo do Imóvel"
                  >
                    {tiposImovel[pedido.categoria_imovel as keyof typeof tiposImovel]?.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {pedido.tipo_imovel === 'OUTRO' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição do Tipo de Imóvel"
                    value={pedido.tipo_imovel_descricao || ''}
                    onChange={e => handleChange('tipo_imovel_descricao', e.target.value)}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Laudo</InputLabel>
                  <Select
                    value={pedido.tipo_laudo}
                    onChange={e => handleChange('tipo_laudo', e.target.value)}
                    label="Tipo de Laudo"
                  >
                    {tiposLaudo.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Observações"
                  value={pedido.observacoes || ''}
                  onChange={e => handleChange('observacoes', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Atividades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h6">Atividades</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddAtividade}>
                Adicionar Atividade
              </Button>
            </Box>

            {pedido.atividades.map((atividade, index) => (
              <Box key={atividade.id} sx={{ mb: 3 }}>
                {index > 0 && <Divider sx={{ my: 3 }} />}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Atividade</InputLabel>
                      <Select
                        value={atividade.tipo}
                        onChange={e => handleAtividadeChange(index, 'tipo', e.target.value)}
                        label="Tipo de Atividade"
                      >
                        {tiposAtividade.map(tipo => (
                          <MenuItem key={tipo} value={tipo}>
                            {tipo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {atividade.tipo === 'PROJETO' && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo de Projeto</InputLabel>
                        <Select
                          value={atividade.tipo_projeto || ''}
                          onChange={e =>
                            handleAtividadeChange(index, 'tipo_projeto', e.target.value)
                          }
                          label="Tipo de Projeto"
                        >
                          {tiposProjeto.map(tipo => (
                            <MenuItem key={tipo} value={tipo}>
                              {tipo}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {atividade.tipo === 'EXECUCAO' && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo de Execução</InputLabel>
                        <Select
                          value={atividade.tipo_execucao || ''}
                          onChange={e =>
                            handleAtividadeChange(index, 'tipo_execucao', e.target.value)
                          }
                          label="Tipo de Execução"
                        >
                          {tiposExecucao.map(tipo => (
                            <MenuItem key={tipo} value={tipo}>
                              {tipo}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Quantidade (m²)"
                      type="number"
                      value={atividade.quantidade_metros_quadrados}
                      onChange={e =>
                        handleAtividadeChange(index, 'quantidade_metros_quadrados', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Descrição do Serviço"
                      value={atividade.descricao_servico}
                      onChange={e =>
                        handleAtividadeChange(index, 'descricao_servico', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor Unitário"
                      type="number"
                      value={atividade.valor_unitario}
                      onChange={e => handleAtividadeChange(index, 'valor_unitario', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Valor Total"
                      type="number"
                      value={atividade.valor_total}
                      onChange={e => handleAtividadeChange(index, 'valor_total', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={atividade.precisa_art}
                          onChange={e =>
                            handleAtividadeChange(index, 'precisa_art', e.target.checked)
                          }
                        />
                      }
                      label="Precisa de ART"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={atividade.precisa_memorial}
                          onChange={e =>
                            handleAtividadeChange(index, 'precisa_memorial', e.target.checked)
                          }
                        />
                      }
                      label="Precisa de Memorial"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={atividade.precisa_projeto}
                          onChange={e =>
                            handleAtividadeChange(index, 'precisa_projeto', e.target.checked)
                          }
                        />
                      }
                      label="Precisa de Projeto"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={atividade.precisa_execucao}
                          onChange={e =>
                            handleAtividadeChange(index, 'precisa_execucao', e.target.checked)
                          }
                        />
                      }
                      label="Precisa de Execução"
                    />
                  </Grid>

                  {/* Anexos da Atividade */}
                  {pedido.anexos.filter(anexo => anexo.atividade_id === atividade.id).length >
                    0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Anexos
                      </Typography>
                      <List dense>
                        {pedido.anexos
                          .filter(anexo => anexo.atividade_id === atividade.id)
                          .map(anexo => (
                            <ListItem
                              key={anexo.id}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveAnexo(anexo.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              }
                            >
                              <ListItemText
                                primary={anexo.nome_original}
                                secondary={`${anexo.tipo} - ${formatBytes(Number(anexo.tamanho))}`}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button color="error" onClick={() => handleRemoveAtividade(index)}>
                        Remover Atividade
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Alteração de Status */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Alterar Status do Pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Novo Status</InputLabel>
              <Select
                value={novoStatus}
                onChange={e => setNovoStatus(e.target.value)}
                label="Novo Status"
              >
                {Object.entries(statusMap).map(([value, { label }]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Observação"
              value={observacaoStatus}
              onChange={e => setObservacaoStatus(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleChangeStatus} disabled={!novoStatus || saving}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button color="error" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Histórico */}
      {pedido?.historico && pedido.historico.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Histórico de Status
            </Typography>
            <List>
              {pedido.historico.map((item, index) => (
                <ListItem key={index} divider={index < pedido.historico.length - 1}>
                  <ListItemText
                    primary={
                      <>
                        <Typography component="span" sx={{ fontWeight: 'bold' }}>
                          {item.usuario_nome}
                        </Typography>
                        {' alterou o status de '}
                        <Chip
                          label={
                            statusMap[item.status_anterior as keyof typeof statusMap]?.label ||
                            item.status_anterior
                          }
                          size="small"
                          sx={{ mx: 1 }}
                        />
                        {' para '}
                        <Chip
                          label={
                            statusMap[item.status_novo as keyof typeof statusMap]?.label ||
                            item.status_novo
                          }
                          size="small"
                          sx={{ mx: 1 }}
                        />
                      </>
                    }
                    secondary={
                      <>
                        {new Date(item.data_alteracao).toLocaleString('pt-BR')}
                        {item.observacao && (
                          <>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: 'block',
                                mt: 1,
                                bgcolor: 'grey.50',
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              {item.observacao}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      )}
    </Box>
  );
}
