import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import Image from 'next/image';
import { FormField } from '../src/components/FormField';
import { usePedidoForm } from '../src/hooks/usePedidoForm';
import { Loading } from '../src/components/Loading';
import { ErrorMessage } from '../src/components/ErrorMessage';
import { SuccessMessage } from '../src/components/SuccessMessage';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import {
  TipoPessoa,
  TipoImovelCategoria,
  TipoServico,
  TipoAtividade,
  Atividade,
  TipoProjeto,
  TipoExecucao,
} from '../src/types';

const SERVICOS: TipoServico[] = [
  'AR CONDICIONADO',
  'SERRALHERIA',
  'VIDRAÇARIA',
  'GESSEIRO',
  'MARMORARIA',
  'CONSTRUTORA',
  'OUTROS',
];

const TIPOS_IMOVEL = {
  RESIDENCIAL: ['APARTAMENTO', 'CASA'],
  COMERCIAL: ['SALA COMERCIAL', 'CASA'],
  OUTROS: ['DESCREVER'],
};

const TIPOS_PROJETO: TipoProjeto[] = [
  'LEVANTAMENTO ARQUITETÔNICO',
  'PROJETO ARQUITETÔNICO',
  'PROJETO ARQUITETÔNICO DE REFORMA',
  'PROJETO DE ADEQUAÇÃO E ACESSIBILIDADE',
  'PROJETO DE ESTRUTURA DE MADEIRA',
  'PROJETO DE ESTRUTURA DE CONCRETO',
  'PROJETO DE ESTRUTURA METÁLICA',
  'PROJETO DE ESTRUTURAS MISTAS',
  'PROJETO DE OUTRAS ESTRUTURAS',
  'PROJETO DE LUMINOTECNICA',
  'PROJETO DE CONDICIONAMENTO ACUSTICO',
  'PROJETO DE SONORIZAÇÃO',
  'PROJETO DE VENTILAÇÃO, EXAUSTÃO E CLIMATIZAÇÃO',
  'PROJETO DE ARQUITETURA DE INTERIORES',
  'PROJETO DE MOBILIÁRIO',
  'PROJETO DE INSTALAÇÕES HIDROSANITÁRIAS PREDIAIS',
  'PROJETO DE INSTALAÇÕES PREDIAIS DE AGUAS PLUVIAIS',
  'PROJETO DE INSTALAÇÕES PREDIAIS DE GÁS CANALIZADO',
  'PROJETO DE INSTALAÇÕES ELETRICAS PREDIAIS DE BAIXA TENSÃO',
  'PROJETO DE COMUNICAÇÃO VISUAL PARA EDIFICAÇÕES',
  'LEVANTAMENTO PAISAGISTICO',
  'PROJETO DE ARQUITETURA PAISAGÍSTICA',
];

const TIPOS_EXECUCAO: TipoExecucao[] = [
  'EXECUÇÃO DE OBRA',
  'REFORMA',
  'ADEQUAÇÃO',
  'INSTALAÇÃO',
  'EXECUÇÃO DE INSTALAÇÃO DE REVESTIMENTOS CERÂMICOS',
  'EXECUÇÃO DE INSTALAÇÃO DE PORCELANATO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO DE MADEIRA',
  'EXECUÇÃO DE ADEQUAÇÃO DE ACESSIBILIDADE',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO VINÍLICO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO LAMINADO',
  'EXECUÇÃO DE INSTALAÇÃO DE CARPETE',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO EMBORRACHADO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO INDUSTRIAL',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO ELEVADO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO TÁTIL',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO INTERTRAVADO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO DE CONCRETO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO DE GRANITO',
  'EXECUÇÃO DE INSTALAÇÃO DE PISO DE MÁRMORE',
  'EXECUÇÃO DE ESTRUTURA DE MADEIRA',
  'EXECUÇÃO DE ESTRUTURA DE CONCRETO',
  'EXECUÇÃO DE ESTRUTURA METÁLICA',
  'EXECUÇÃO DE ESTRUTURAS MISTAS',
  'EXECUÇÃO DE OUTRAS ESTRUTURAS',
  'EXECUÇÃO DE INSTALAÇÕES LUMINOTECNICAS',
  'EXECUÇÃO DE INSTALAÇÕES DE CONDICIONAMENTO ACUSTICO',
  'EXECUÇÃO DE SONORIZAÇÃO',
  'EXECUÇÃO DE INSTALAÇÃO DE SISTEMAS DE VENTILAÇÃO, EXAUSTÃO E CLIMATIZAÇÃO',
  'EXECUÇÃO DE INSTALAÇÕES DE ARQUITETURA DE INTERIORES',
  'EXECUÇÃO DE INSTALAÇÃO DE MOBILIÁRIO',
  'EXECUÇÃO DE INSTALAÇÕES HIDROSANITÁRIAS PREDIAIS',
  'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE AGUAS PLUVIAIS',
  'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE GÁS CANALIZADO',
  'EXECUÇÃO DE INSTALAÇÕES ELETRICAS PREDIAIS DE BAIXA TENSÃO',
  'EXECUÇÃO DE INSTALAÇÃO DE COMUNICAÇÃO VISUAL PARA EDIFICAÇÕES',
  'EXECUÇÃO DE PAISAGISMO',
];

const Checkout = () => {
  const { formState, handleSubmit, handleChange, loading, error, success } = usePedidoForm();
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('fisica');
  const [enderecoObraIgual, setEnderecoObraIgual] = useState(false);
  const [categoriaImovel, setCategoriaImovel] = useState<TipoImovelCategoria>('RESIDENCIAL');
  const [tipoImovel, setTipoImovel] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState<TipoServico[]>([]);

  const handleAtividadeChange = (index: number, field: keyof Atividade, value: any) => {
    const novasAtividades = [...formState.atividades] as Atividade[];
    let valorFinal = value;

    if (field === 'quantidadeMetrosQuadrados') {
      valorFinal = value === '' || value === null ? 0 : parseFloat(value);
      if (isNaN(valorFinal)) valorFinal = 0;
    }

    novasAtividades[index] = {
      ...novasAtividades[index],
      [field]: valorFinal,
    };

    if (field === 'tipo') {
      novasAtividades[index].tipo = valorFinal as TipoAtividade;
      novasAtividades[index].tipoProjeto = valorFinal === 'PROJETO' ? 'LEVANTAMENTO ARQUITETÔNICO' : undefined;
      novasAtividades[index].tipoExecucao = valorFinal === 'EXECUCAO' ? 'EXECUÇÃO DE OBRA' : undefined;
    }

    handleChange('atividades', novasAtividades);

    // Atualizar valor total do pedido
    const valorTotal = calcularValorTotal(novasAtividades);
    handleChange('valorTotal', valorTotal);
  };

  const adicionarAtividade = () => {
    const novaAtividade: Atividade = {
      tipo: 'PROJETO' as TipoAtividade,
      tipoProjeto: 'LEVANTAMENTO ARQUITETÔNICO',
      tipoExecucao: undefined,
      quantidadeMetrosQuadrados: 0,
      descricaoServico: '',
      precisaArt: false,
      precisaMemorial: false,
      precisaProjeto: false,
      precisaExecucao: false,
      valorUnitario: 0,
      valorTotal: 0,
      projeto: null,
      fotos: []
    };

    handleChange('atividades', [...formState.atividades, novaAtividade]);
  };

  const removerAtividade = (index: number) => {
    const novasAtividades = formState.atividades.filter((_, i) => i !== index);
    handleChange('atividades', novasAtividades);
  };

  const handleEnderecoObraIgualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    handleChange('enderecoObraIgual', checked);

    if (checked) {
      handleChange('cepObra', formState.cep);
      handleChange('logradouroObra', formState.logradouro);
      handleChange('numeroObra', formState.numero);
      handleChange('complementoObra', formState.complemento);
      handleChange('bairroObra', formState.bairro);
      handleChange('cidadeObra', formState.cidade);
      handleChange('estadoObra', formState.estado);
    }
  };

  const calcularValorTotal = (atividades: Atividade[]): number => {
    const valorBase = atividades.length > 0 ? 149.9 : 0;
    const valorAtividadeAdicional = 89.9;
    const taxaCau = 119.61;

    let total = valorBase;

    if (atividades.length > 1) {
      total += (atividades.length - 1) * valorAtividadeAdicional;
    }

    if (atividades.some(a => a.tipo === 'EXECUCAO')) {
      total += taxaCau;
    }

    return Number(total.toFixed(2));
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background */}
      <Box sx={{ position: 'fixed', width: '100%', height: '100vh', bottom: 0, zIndex: -1 }}>
        <Image src="/images/bg1.jpg" alt="Background" layout="fill" objectFit="cover" priority />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(161, 111, 111, 0.2)',
          }}
        />
      </Box>

      {/* Conteúdo */}
      <Box sx={{ pt: 15, pb: 20, px: { xs: 2, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: '#fff',
          }}
        >
          Solicitação de Laudo
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: 'rgba(161, 111, 111, 0.9)',
                backdropFilter: 'blur(3px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* 1. Quem Sou? */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      1. Quem Sou?
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={tipoPessoa}
                        onChange={e => {
                          setTipoPessoa(e.target.value as TipoPessoa);
                          handleChange('tipoPessoa', e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="fisica"
                          control={
                            <Radio
                              sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                            />
                          }
                          label={<Typography sx={{ color: '#fff' }}>Pessoa Física</Typography>}
                        />
                        <FormControlLabel
                          value="juridica"
                          control={
                            <Radio
                              sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                            />
                          }
                          label={<Typography sx={{ color: '#fff' }}>Pessoa Jurídica</Typography>}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 2. Dados do Contratante */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      2. Dados do Contratante
                    </Typography>
                  </Grid>

                  {tipoPessoa === 'fisica' ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Nome Completo"
                          name="nome"
                          value={formState.nome}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="CPF"
                          name="cpf"
                          value={formState.cpf}
                          onChange={handleChange}
                          required
                          mask="cpf"
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Razão Social"
                          name="razaoSocial"
                          value={formState.razaoSocial}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="CNPJ"
                          name="cnpj"
                          value={formState.cnpj}
                          onChange={handleChange}
                          required
                          mask="cnpj"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Inscrição Estadual"
                          name="inscricaoEstadual"
                          value={formState.inscricaoEstadual}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Nome do Responsável"
                          name="nome"
                          value={formState.nome}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="CPF do Responsável"
                          name="cpf"
                          value={formState.cpf}
                          onChange={handleChange}
                          required
                          mask="cpf"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Site da Empresa"
                          name="site"
                          value={formState.site}
                          onChange={handleChange}
                          placeholder="https://www.seusite.com.br"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Redes Sociais"
                          name="redesSociais"
                          value={formState.redesSociais}
                          onChange={handleChange}
                          placeholder="@instagram, facebook.com/pagina"
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6}>
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      label="Telefone"
                      name="telefone"
                      value={formState.telefone}
                      onChange={handleChange}
                      required
                      mask="telefone"
                    />
                  </Grid>

                  {/* 3. Endereço do Contratante */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      3. Endereço do Contratante
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormField
                      label="CEP"
                      name="cep"
                      value={formState.cep}
                      onChange={handleChange}
                      required
                      mask="cep"
                    />
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <FormField
                      label="Logradouro"
                      name="logradouro"
                      value={formState.logradouro}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormField
                      label="Bairro"
                      name="bairro"
                      value={formState.bairro}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormField
                      label="Cidade/UF"
                      name="cidade"
                      value={formState.cidade}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormField
                      label="Número"
                      name="numero"
                      value={formState.numero}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <FormField
                      label="Complemento"
                      name="complemento"
                      value={formState.complemento}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* 4. Endereço da Obra */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      4. Endereço da Obra
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={enderecoObraIgual}
                          onChange={handleEnderecoObraIgualChange}
                          sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                        />
                      }
                      label={
                        <Typography sx={{ color: '#fff' }}>
                          Utilizar endereço do contratante
                        </Typography>
                      }
                    />
                  </Grid>

                  {!enderecoObraIgual && (
                    <>
                      <Grid item xs={12} sm={3}>
                        <FormField
                          label="CEP"
                          name="cepObra"
                          value={formState.cepObra}
                          onChange={handleChange}
                          required={!enderecoObraIgual}
                          mask="cep"
                          disabled={enderecoObraIgual}
                        />
                      </Grid>

                      <Grid item xs={12} sm={9}>
                        <FormField
                          label="Logradouro"
                          name="logradouroObra"
                          value={formState.logradouroObra}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Bairro"
                          name="bairroObra"
                          value={formState.bairroObra}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormField
                          label="Cidade/UF"
                          name="cidadeObra"
                          value={formState.cidadeObra}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <FormField
                          label="Número"
                          name="numeroObra"
                          value={formState.numeroObra}
                          onChange={handleChange}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} sm={9}>
                        <FormField
                          label="Complemento"
                          name="complementoObra"
                          value={formState.complementoObra}
                          onChange={handleChange}
                        />
                      </Grid>
                    </>
                  )}

                  {/* 5. Tipo de Imóvel */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      5. Tipo de Imóvel
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <FormLabel sx={{ color: '#fff', mb: 1 }}>Categoria</FormLabel>
                      <Select
                        value={categoriaImovel}
                        onChange={e => {
                          setCategoriaImovel(e.target.value as TipoImovelCategoria);
                          handleChange('categoriaImovel', e.target.value);
                        }}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                      >
                        {Object.keys(TIPOS_IMOVEL).map(categoria => (
                          <MenuItem key={categoria} value={categoria}>
                            {categoria}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <FormLabel sx={{ color: '#fff', mb: 1 }}>Tipo</FormLabel>
                      <Select
                        value={tipoImovel}
                        onChange={e => {
                          setTipoImovel(e.target.value);
                          handleChange('tipoImovel', e.target.value);
                        }}
                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                      >
                        {TIPOS_IMOVEL[categoriaImovel].map(tipo => (
                          <MenuItem key={tipo} value={tipo}>
                            {tipo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {tipoImovel === 'DESCREVER' && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Descrição do Imóvel"
                        name="tipoImovelDescricao"
                        value={formState.tipoImovelDescricao}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Grid>

                  {/* 6. Serviços Prestados */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      6. Serviços Prestados
                    </Typography>
                    <Box>
                      {SERVICOS.map(servico => (
                        <FormControlLabel
                          key={servico}
                          control={
                            <Checkbox
                              checked={servicosSelecionados.includes(servico)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setServicosSelecionados([...servicosSelecionados, servico]);
                                } else {
                                  setServicosSelecionados(
                                    servicosSelecionados.filter(s => s !== servico)
                                  );
                                }
                              }}
                              sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                            />
                          }
                          label={<Typography sx={{ color: '#fff' }}>{servico}</Typography>}
                        />
                      ))}
                    </Box>

                    {servicosSelecionados.includes('OUTROS') && (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Descrição do Serviço"
                        name="servicoOutrosDescricao"
                        value={formState.servicoOutrosDescricao}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Grid>

                  {/* 7. Descritivo de Atividades */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                      7. Descritivo de Atividades
                    </Typography>

                    {formState.atividades.map((atividade, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 4,
                          p: 2,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography sx={{ color: '#fff' }}>Atividade {index + 1}</Typography>
                          {index > 0 && (
                            <IconButton
                              onClick={() => removerAtividade(index)}
                              sx={{ color: '#CBB271' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>

                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                          <RadioGroup
                            value={atividade.tipo}
                            onChange={e =>
                              handleAtividadeChange(index, 'tipo', e.target.value as TipoAtividade)
                            }
                          >
                            <FormControlLabel
                              value="PROJETO"
                              control={
                                <Radio
                                  sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                                />
                              }
                              label={<Typography sx={{ color: '#fff' }}>Projeto</Typography>}
                            />
                            <FormControlLabel
                              value="EXECUCAO"
                              control={
                                <Radio
                                  sx={{ color: '#CBB271', '&.Mui-checked': { color: '#CBB271' } }}
                                />
                              }
                              label={<Typography sx={{ color: '#fff' }}>Execução</Typography>}
                            />
                          </RadioGroup>
                        </FormControl>

                        {atividade.tipo === 'PROJETO' ? (
                          <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <FormLabel sx={{ color: '#CBB271', mb: 1 }}>
                                Tipo de Projeto
                              </FormLabel>
                              <Select
                                value={atividade.tipoProjeto}
                                onChange={e =>
                                  handleAtividadeChange(index, 'tipoProjeto', e.target.value)
                                }
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                }}
                              >
                                {TIPOS_PROJETO.map(tipo => (
                                  <MenuItem key={tipo} value={tipo}>
                                    {tipo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormField
                              label="Quantidade (m²)"
                              type="number"
                              name={`atividades[${index}].quantidadeMetrosQuadrados`}
                              value={atividade.quantidadeMetrosQuadrados ?? 0}
                              onChange={e =>
                                handleAtividadeChange(
                                  index,
                                  'quantidadeMetrosQuadrados',
                                  e.target.value
                                )
                              }
                              required
                              min="0"
                              step="0.01"
                              sx={{
                                mb: 2,
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <FormLabel sx={{ color: '#CBB271', mb: 1 }}>
                                Tipo de Execução
                              </FormLabel>
                              <Select
                                value={atividade.tipoExecucao}
                                onChange={e =>
                                  handleAtividadeChange(index, 'tipoExecucao', e.target.value)
                                }
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CBB271',
                                  },
                                }}
                              >
                                {TIPOS_EXECUCAO.map(tipo => (
                                  <MenuItem key={tipo} value={tipo}>
                                    {tipo}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormField
                              label="Quantidade (m²)"
                              type="number"
                              name={`atividades[${index}].quantidadeMetrosQuadrados`}
                              value={atividade.quantidadeMetrosQuadrados ?? 0}
                              onChange={e =>
                                handleAtividadeChange(
                                  index,
                                  'quantidadeMetrosQuadrados',
                                  e.target.value
                                )
                              }
                              required
                              min="0"
                              step="0.01"
                              sx={{
                                mb: 2,
                              }}
                            />
                          </>
                        )}

                        <FormField
                          label="Descrição do Serviço"
                          multiline
                          rows={3}
                          value={atividade.descricaoServico}
                          onChange={e =>
                            handleAtividadeChange(index, 'descricaoServico', e.target.value)
                          }
                          sx={{
                            mb: 2,
                          }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{ color: '#000', borderColor: '#fff', backgroundColor: '#fff' }}
                          >
                            Anexar Projeto
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.dwg,.dxf"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  handleAtividadeChange(index, 'projeto', e.target.files[0]);
                                }
                              }}
                            />
                          </Button>

                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{ color: '#000', borderColor: '#fff', backgroundColor: '#fff' }}
                          >
                            Anexar Fotos
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              multiple
                              onChange={e => {
                                if (e.target.files) {
                                  handleAtividadeChange(index, 'fotos', Array.from(e.target.files));
                                }
                              }}
                            />
                          </Button>
                        </Box>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={adicionarAtividade}
                      sx={{ color: '#fff', borderColor: '#fff', mt: 2 }}
                    >
                      Vincular Nova Atividade
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Resumo do Pedido */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 300 }}>
                Resumo do Pedido
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between', mb: 1 }}
                >
                  <span>Serviço Base:</span>
                  <span>R$ 149,90</span>
                </Typography>

                {formState.atividades.length > 1 && (
                  <>
                    <Typography variant="body1" sx={{ color: '#fff', mt: 2 }}>
                      Atividades Adicionais ({formState.atividades.length - 1}):
                    </Typography>
                    {formState.atividades.slice(1).map((_, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        sx={{
                          color: '#fff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          ml: 2,
                        }}
                      >
                        <span>Atividade {index + 2}:</span>
                        <span>R$ 89,90</span>
                      </Typography>
                    ))}
                  </>
                )}

                {formState.atividades.some(a => a.tipo === 'EXECUCAO') && (
                  <Typography
                    variant="body1"
                    sx={{ color: '#fff', display: 'flex', justifyContent: 'space-between', mt: 2 }}
                  >
                    <span>Taxa CAU:</span>
                    <span>R$ 119,61</span>
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 300 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: '#CBB271', fontWeight: 500, textShadow: '0 0 10px #000' }}
                >
                  R$ {formState.valorTotal.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: '#CBB271',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#9e8c5a',
                  },
                }}
              >
                {loading ? 'Processando...' : 'Finalizar Pedido'}
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message="Pedido realizado com sucesso!" />}
      </Box>
    </Box>
  );
};

export default Checkout;
