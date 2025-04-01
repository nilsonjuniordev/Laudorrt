import { useState, FormEvent } from 'react';
import { PedidoService } from '../services/api';
import { CEPService } from '../services/cep';

interface Atividade {
  tipo: string;
  tipoProjeto?: string;
  tipoExecucao?: string;
  quantidadeMetrosQuadrados?: number;
  descricaoServico?: string;
  precisaArt: boolean;
  precisaMemorial: boolean;
  precisaProjeto: boolean;
  precisaExecucao: boolean;
  valorUnitario: number;
  valorTotal: number;
  projeto?: File;
  fotos?: File[];
}

interface FormState {
  tipoPessoa: 'fisica' | 'juridica';
  nome: string;
  cpf: string;
  cnpj: string;
  razaoSocial: string;
  inscricaoEstadual: string;
  email: string;
  telefone: string;
  site: string;
  redesSociais: string;

  // Endereço do contratante
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  // Endereço da obra
  enderecoObraIgual: boolean;
  cepObra: string;
  logradouroObra: string;
  numeroObra: string;
  complementoObra: string;
  bairroObra: string;
  cidadeObra: string;
  estadoObra: string;

  // Tipo de imóvel
  categoriaImovel: string;
  tipoImovel: string;
  tipoImovelDescricao: string;
  servicoOutrosDescricao: string;

  // Campos específicos do pedido
  valorTotal: number;
  observacoes: string;

  // Atividades
  atividades: Atividade[];
}

const initialState: FormState = {
  tipoPessoa: 'fisica',
  nome: '',
  cpf: '',
  cnpj: '',
  razaoSocial: '',
  inscricaoEstadual: '',
  email: '',
  telefone: '',
  site: '',
  redesSociais: '',

  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',

  enderecoObraIgual: false,
  cepObra: '',
  logradouroObra: '',
  numeroObra: '',
  complementoObra: '',
  bairroObra: '',
  cidadeObra: '',
  estadoObra: '',

  categoriaImovel: 'RESIDENCIAL',
  tipoImovel: '',
  tipoImovelDescricao: '',
  servicoOutrosDescricao: '',

  valorTotal: 0,
  observacoes: '',

  atividades: [],
};

export function usePedidoForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);

  const handleChange = async (
    nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?: any
  ) => {
    let fieldName: string;
    let fieldValue: any;

    if (typeof nameOrEvent === 'string') {
      fieldName = nameOrEvent;
      fieldValue = value;
    } else {
      fieldName = nameOrEvent.target.name;
      fieldValue = nameOrEvent.target.value;
    }

    console.log(`Campo alterado: ${fieldName}, Valor: ${fieldValue}`);

    setFormState(prev => ({
      ...prev,
      [fieldName]: fieldValue,
    }));

    if (
      (fieldName === 'cep' || fieldName === 'cepObra') &&
      fieldValue.replace(/\D/g, '').length === 8
    ) {
      setLoadingCEP(true);
      try {
        const endereco = await CEPService.buscarCEP(fieldValue);

        if (fieldName === 'cep') {
          setFormState(prev => ({
            ...prev,
            logradouro: endereco.logradouro || '',
            bairro: endereco.bairro || '',
            cidade: endereco.localidade || '',
            estado: endereco.uf || '',
            complemento: endereco.complemento || '',
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            logradouroObra: endereco.logradouro || '',
            bairroObra: endereco.bairro || '',
            cidadeObra: endereco.localidade || '',
            estadoObra: endereco.uf || '',
            complementoObra: endereco.complemento || '',
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar CEP');
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = {
        tipo_pessoa: formState.tipoPessoa,
        nome_responsavel: formState.nome,
        cpf_cnpj: formState.tipoPessoa === 'fisica' ? formState.cpf : formState.cnpj,
        email: formState.email,
        telefone: formState.telefone,
        site: formState.site,
        social_media: formState.redesSociais,

        // Endereço do contratante
        cep: formState.cep,
        logradouro: formState.logradouro,
        numero: formState.numero,
        complemento: formState.complemento,
        bairro: formState.bairro,
        cidade: formState.cidade,
        estado: formState.estado,

        // Endereço da obra
        endereco_obra_igual: formState.enderecoObraIgual,
        cep_obra: formState.cepObra,
        logradouro_obra: formState.logradouroObra,
        numero_obra: formState.numeroObra,
        complemento_obra: formState.complementoObra,
        bairro_obra: formState.bairroObra,
        cidade_obra: formState.cidadeObra,
        estado_obra: formState.estadoObra,

        // Tipo de imóvel
        categoria_imovel: formState.categoriaImovel,
        tipo_imovel: formState.tipoImovel,
        tipo_imovel_descricao: formState.tipoImovelDescricao,

        // Campos específicos do pedido
        tipo_laudo: 'RRT',
        valor_total: formState.valorTotal,
        observacoes: formState.observacoes,

        // Campos de pessoa jurídica
        razao_social: formState.razaoSocial,
        inscricao_estadual: formState.inscricaoEstadual,
        cpf_responsavel: formState.cpf,

        // Atividades
        atividades: formState.atividades.map(atividade => ({
          tipo: atividade.tipo,
          tipo_projeto: atividade.tipoProjeto,
          tipo_execucao: atividade.tipoExecucao,
          quantidade_metros_quadrados: atividade.quantidadeMetrosQuadrados,
          descricao_servico: atividade.descricaoServico,
          precisa_art: atividade.precisaArt,
          precisa_memorial: atividade.precisaMemorial,
          precisa_projeto: atividade.precisaProjeto,
          precisa_execucao: atividade.precisaExecucao,
          valor_unitario: atividade.valorUnitario,
          valor_total: atividade.valorTotal,
          projeto: atividade.projeto,
          fotos: atividade.fotos,
        })),
      };

      // Criar FormData para enviar arquivos
      const formDataWithFiles = new FormData();
      formDataWithFiles.append('data', JSON.stringify(formData));

      // Adicionar arquivos
      formState.atividades.forEach((atividade, index) => {
        if (atividade.projeto) {
          formDataWithFiles.append(`atividades[${index}].projeto`, atividade.projeto);
        }
        if (atividade.fotos && atividade.fotos.length > 0) {
          atividade.fotos.forEach((foto, fotoIndex) => {
            formDataWithFiles.append(`atividades[${index}].fotos[${fotoIndex}]`, foto);
          });
        }
      });

      console.log('Enviando dados:', formData);
      const response = await PedidoService.criar(formDataWithFiles);

      if (response.data && response.data.pedido) {
        window.location.href = `/obrigado?pedido_id=${response.data.pedido.id}`;
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      setError('Erro ao enviar pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    setFormState,
    handleChange,
    handleSubmit,
    loading,
    loadingCEP,
    error,
    success,
  };
}

function calcularValorTotal(atividades: Atividade[]): number {
  const valorBase = 149.9;
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
}
