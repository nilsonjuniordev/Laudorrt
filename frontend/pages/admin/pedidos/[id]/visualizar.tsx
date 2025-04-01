import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../src/hooks/useAuth';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../../../../src/services/api';
import { formatarData, formatarMoeda } from '../../../../src/utils/format';
import Image from 'next/image';

const statusColors = {
  aguardando_pagamento: 'warning',
  pago: 'info',
  em_processo: 'primary',
  concluido: 'success',
  cancelado: 'error',
} as const;

const statusLabels = {
  aguardando_pagamento: 'Aguardando Pagamento',
  pago: 'Pago',
  em_processo: 'Em Processo',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isImageFile = (tipo: string) => {
  return tipo.startsWith('image/');
};

export default function VisualizarPedido() {
  useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id) {
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
      console.error('Erro ao buscar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAnexo = async (anexoId: string, nomeOriginal: string) => {
    try {
      const response = await api.get(`/pedidos/${id}/anexos/${anexoId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomeOriginal);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
    }
  };

  const handleViewImage = async (anexoId: string) => {
    try {
      const response = await api.get(`/pedidos/${id}/anexos/${anexoId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setSelectedImage(url);
      setLightboxOpen(true);
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
    }
  };

  const handleDownloadPlanilha = async () => {
    try {
      const response = await api.get(`/pedidos/${id}/planilha`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pedido-${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar planilha:', error);
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
    <Box sx={{ p: 3, bgcolor: '#F5F5F5' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Pedido #{pedido?.id ? pedido.id.slice(0, 8) : ''}</Typography>
          <Chip
            label={statusLabels[pedido.status] || pedido.status}
            color={statusColors[pedido.status] || 'default'}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => router.push(`/admin/pedidos/${pedido.id}`)}>
            Editar Pedido
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadPlanilha}>
            Baixar Planilha
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
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo de Pessoa
                </Typography>
                <Typography>
                  {pedido.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Typography>
              </Grid>

              {pedido.tipo_pessoa === 'juridica' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Razão Social
                    </Typography>
                    <Typography>{pedido.razao_social}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Inscrição Estadual
                    </Typography>
                    <Typography>{pedido.inscricao_estadual}</Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nome do Responsável
                </Typography>
                <Typography>{pedido.nome_responsavel}</Typography>
              </Grid>

              {pedido.tipo_pessoa === 'juridica' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    CPF do Responsável
                  </Typography>
                  <Typography>{pedido.cpf_responsavel}</Typography>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  CPF/CNPJ
                </Typography>
                <Typography>{pedido.cpf_cnpj}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Telefone
                </Typography>
                <Typography>{pedido.telefone}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography>{pedido.email}</Typography>
              </Grid>

              {pedido.site && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Site
                  </Typography>
                  <Typography>{pedido.site}</Typography>
                </Grid>
              )}

              {pedido.social_media && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Redes Sociais
                  </Typography>
                  <Typography>{pedido.social_media}</Typography>
                </Grid>
              )}
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
                <Typography variant="subtitle2" color="text.secondary">
                  CEP
                </Typography>
                <Typography>{pedido.cep}</Typography>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography variant="subtitle2" color="text.secondary">
                  Logradouro
                </Typography>
                <Typography>{pedido.logradouro}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Número
                </Typography>
                <Typography>{pedido.numero}</Typography>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography variant="subtitle2" color="text.secondary">
                  Complemento
                </Typography>
                <Typography>{pedido.complemento || '-'}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Bairro
                </Typography>
                <Typography>{pedido.bairro}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cidade
                </Typography>
                <Typography>{pedido.cidade}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Typography>{pedido.estado}</Typography>
              </Grid>
            </Grid>

            {!pedido.endereco_obra_igual && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Endereço da Obra
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      CEP
                    </Typography>
                    <Typography>{pedido.cep_obra}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Logradouro
                    </Typography>
                    <Typography>{pedido.logradouro_obra}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Número
                    </Typography>
                    <Typography>{pedido.numero_obra}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Complemento
                    </Typography>
                    <Typography>{pedido.complemento_obra || '-'}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bairro
                    </Typography>
                    <Typography>{pedido.bairro_obra}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cidade
                    </Typography>
                    <Typography>{pedido.cidade_obra}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <Typography>{pedido.estado_obra}</Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>

        {/* Informações do Imóvel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Informações do Imóvel
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Categoria do Imóvel
                </Typography>
                <Typography>{pedido.categoria_imovel}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo do Imóvel
                </Typography>
                <Typography>{pedido.tipo_imovel}</Typography>
              </Grid>

              {pedido.tipo_imovel_descricao && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descrição do Tipo
                  </Typography>
                  <Typography>{pedido.tipo_imovel_descricao}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo de Laudo
                </Typography>
                <Typography>{pedido.tipo_laudo}</Typography>
              </Grid>

              {pedido.observacoes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Observações
                  </Typography>
                  <Typography>{pedido.observacoes}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Atividades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Atividades
            </Typography>

            {pedido.atividades.map((atividade: any, index: number) => (
              <Box key={atividade.id} sx={{ mb: index < pedido.atividades.length - 1 ? 2 : 0 }}>
                {index > 0 && <Divider sx={{ my: 2 }} />}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tipo
                    </Typography>
                    <Typography>{atividade.tipo}</Typography>
                  </Grid>

                  {atividade.tipo_projeto && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tipo de Projeto
                      </Typography>
                      <Typography>{atividade.tipo_projeto}</Typography>
                    </Grid>
                  )}

                  {atividade.tipo_execucao && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tipo de Execução
                      </Typography>
                      <Typography>{atividade.tipo_execucao}</Typography>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Quantidade (m²)
                    </Typography>
                    <Typography>{atividade.quantidade_metros_quadrados}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descrição do Serviço
                    </Typography>
                    <Typography>{atividade.descricao_servico}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Valor Unitário
                    </Typography>
                    <Typography>{formatarMoeda(Number(atividade.valor_unitario))}</Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Valor Total
                    </Typography>
                    <Typography>{formatarMoeda(Number(atividade.valor_total))}</Typography>
                  </Grid>

                  {/* Anexos da Atividade */}
                  {pedido.anexos.filter((anexo: any) => anexo.atividade_id === atividade.id)
                    .length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Anexos
                      </Typography>
                      <List dense>
                        {pedido.anexos
                          .filter((anexo: any) => anexo.atividade_id === atividade.id)
                          .map((anexo: any) => (
                            <ListItem
                              key={anexo.id}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  onClick={() => handleDownloadAnexo(anexo.id, anexo.nome_original)}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              }
                            >
                              {isImageFile(anexo.tipo_arquivo) ? (
                                <Box
                                  sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                      opacity: 0.8,
                                    },
                                  }}
                                  onClick={() => handleViewImage(anexo.id)}
                                >
                                  <Image
                                    src={`/api/pedidos/${pedido.id}/anexos/${anexo.id}`}
                                    alt={anexo.nome_original}
                                    width={50}
                                    height={50}
                                    style={{ objectFit: 'cover', marginRight: '10px' }}
                                  />
                                  <ListItemText
                                    primary={anexo.nome_original}
                                    secondary={`${anexo.tipo_arquivo} - ${formatBytes(Number(anexo.tamanho))}`}
                                  />
                                </Box>
                              ) : (
                                <ListItemText
                                  primary={anexo.nome_original}
                                  secondary={`${anexo.tipo_arquivo} - ${formatBytes(Number(anexo.tamanho))}`}
                                />
                              )}
                            </ListItem>
                          ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Histórico */}
        {pedido.historico.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Histórico
              </Typography>

              <List dense>
                {pedido.historico.map((item: any) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" sx={{ fontWeight: 'bold' }}>
                            {item.usuario_nome}
                          </Typography>
                          {' alterou o status de '}
                          <Typography component="span" sx={{ fontWeight: 'bold' }}>
                            {statusLabels[item.status_anterior] || item.status_anterior}
                          </Typography>
                          {' para '}
                          <Typography component="span" sx={{ fontWeight: 'bold' }}>
                            {statusLabels[item.status_novo] || item.status_novo}
                          </Typography>
                        </>
                      }
                      secondary={
                        <>
                          {formatarData(item.data_alteracao)}
                          {item.observacao && (
                            <>
                              <br />
                              Observação: {item.observacao}
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
      </Grid>

      {/* Lightbox para visualização de imagens */}
      <Dialog
        open={lightboxOpen}
        onClose={() => {
          setLightboxOpen(false);
          setSelectedImage('');
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <img
            src={selectedImage}
            alt="Visualização"
            style={{ maxWidth: '100%', maxHeight: '90vh' }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLightboxOpen(false);
              setSelectedImage('');
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
