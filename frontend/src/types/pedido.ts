export type TipoPessoa = 'fisica' | 'juridica';
export type TipoAtividade = 'PROJETO' | 'EXECUCAO';
export type TipoImovelCategoria = 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL';

export interface Atividade {
  tipo: TipoAtividade;
  tipoProjeto?: string;
  tipoExecucao?: string;
  quantidadeMetrosQuadrados: number;
  descricaoServico: string;
  precisaArt: boolean;
  precisaMemorial: boolean;
  precisaProjeto: boolean;
  precisaExecucao: boolean;
  valorUnitario: number;
  valorTotal: number;
  projeto: File | null;
  fotos: File[];
}

export interface FormState {
  // Campos de identificação
  tipoPessoa: TipoPessoa;
  nome: string;
  cpf: string;
  cnpj: string;
  email: string;
  telefone: string;
  site?: string;
  redesSociais?: string;

  // Campos de pessoa jurídica
  razaoSocial?: string;
  inscricaoEstadual?: string;

  // Endereço do contratante
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;

  // Endereço da obra
  enderecoObraIgual: boolean;
  cepObra?: string;
  logradouroObra?: string;
  numeroObra?: string;
  complementoObra?: string;
  bairroObra?: string;
  cidadeObra?: string;
  estadoObra?: string;

  // Tipo de imóvel
  categoriaImovel: TipoImovelCategoria;
  tipoImovel: string;
  tipoImovelDescricao?: string;

  // Atividades e serviços
  servicoOutrosDescricao?: string;
  atividades: Atividade[];
  observacoes?: string;
}
