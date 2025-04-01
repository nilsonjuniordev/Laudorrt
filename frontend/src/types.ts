export type TipoPessoa = 'fisica' | 'juridica';
export type TipoImovelCategoria = 'RESIDENCIAL' | 'COMERCIAL' | 'OUTROS';
export type TipoServico =
  | 'AR CONDICIONADO'
  | 'SERRALHERIA'
  | 'VIDRAÇARIA'
  | 'GESSEIRO'
  | 'MARMORARIA'
  | 'CONSTRUTORA'
  | 'OUTROS';
export type TipoAtividade = 'PROJETO' | 'EXECUCAO';
export type TipoProjeto =
  | 'LEVANTAMENTO ARQUITETÔNICO'
  | 'PROJETO ARQUITETÔNICO'
  | 'PROJETO ARQUITETÔNICO DE REFORMA'
  | 'PROJETO DE ADEQUAÇÃO E ACESSIBILIDADE'
  | 'PROJETO DE ESTRUTURA DE MADEIRA'
  | 'PROJETO DE ESTRUTURA DE CONCRETO'
  | 'PROJETO DE ESTRUTURA METÁLICA'
  | 'PROJETO DE ESTRUTURAS MISTAS'
  | 'PROJETO DE OUTRAS ESTRUTURAS'
  | 'PROJETO DE LUMINOTECNICA'
  | 'PROJETO DE CONDICIONAMENTO ACUSTICO'
  | 'PROJETO DE SONORIZAÇÃO'
  | 'PROJETO DE VENTILAÇÃO, EXAUSTÃO E CLIMATIZAÇÃO'
  | 'PROJETO DE ARQUITETURA DE INTERIORES'
  | 'PROJETO DE MOBILIÁRIO'
  | 'PROJETO DE INSTALAÇÕES HIDROSANITÁRIAS PREDIAIS'
  | 'PROJETO DE INSTALAÇÕES PREDIAIS DE AGUAS PLUVIAIS'
  | 'PROJETO DE INSTALAÇÕES PREDIAIS DE GÁS CANALIZADO'
  | 'PROJETO DE INSTALAÇÕES ELETRICAS PREDIAIS DE BAIXA TENSÃO'
  | 'PROJETO DE COMUNICAÇÃO VISUAL PARA EDIFICAÇÕES'
  | 'LEVANTAMENTO PAISAGISTICO'
  | 'PROJETO DE ARQUITETURA PAISAGÍSTICA';
export type TipoExecucao =
  | 'EXECUÇÃO DE OBRA'
  | 'REFORMA'
  | 'ADEQUAÇÃO'
  | 'INSTALAÇÃO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE REVESTIMENTOS CERÂMICOS'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PORCELANATO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO DE MADEIRA'
  | 'EXECUÇÃO DE ADEQUAÇÃO DE ACESSIBILIDADE'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO VINÍLICO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO LAMINADO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE CARPETE'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO EMBORRACHADO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO INDUSTRIAL'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO ELEVADO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO TÁTIL'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO INTERTRAVADO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO DE CONCRETO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO DE GRANITO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO DE MÁRMORE'
  | 'EXECUÇÃO DE ESTRUTURA DE MADEIRA'
  | 'EXECUÇÃO DE ESTRUTURA DE CONCRETO'
  | 'EXECUÇÃO DE ESTRUTURA METÁLICA'
  | 'EXECUÇÃO DE ESTRUTURAS MISTAS'
  | 'EXECUÇÃO DE OUTRAS ESTRUTURAS'
  | 'EXECUÇÃO DE INSTALAÇÕES LUMINOTECNICAS'
  | 'EXECUÇÃO DE INSTALAÇÕES DE CONDICIONAMENTO ACUSTICO'
  | 'EXECUÇÃO DE SONORIZAÇÃO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE SISTEMAS DE VENTILAÇÃO, EXAUSTÃO E CLIMATIZAÇÃO'
  | 'EXECUÇÃO DE INSTALAÇÕES DE ARQUITETURA DE INTERIORES'
  | 'EXECUÇÃO DE INSTALAÇÃO DE MOBILIÁRIO'
  | 'EXECUÇÃO DE INSTALAÇÕES HIDROSANITÁRIAS PREDIAIS'
  | 'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE AGUAS PLUVIAIS'
  | 'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE GÁS CANALIZADO'
  | 'EXECUÇÃO DE INSTALAÇÕES ELETRICAS PREDIAIS DE BAIXA TENSÃO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE COMUNICAÇÃO VISUAL PARA EDIFICAÇÕES'
  | 'EXECUÇÃO DE PAISAGISMO'
  | 'EXECUÇÃO DE OBRA DE INTERIORES'
  | 'EXECUÇÃO DE REFORMA DE INTERIORES'
  | 'EXECUÇÃO DE MOBILIÁRIO'
  | 'EXECUÇÃO DE OBRA DE ARQUITETURA PAISAGISTICA';

export interface Atividade {
  tipo: TipoAtividade;
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
  projeto?: File | null;
  fotos?: File[];
}

export interface FormState {
  tipoPessoa: TipoPessoa;
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
  categoriaImovel: TipoImovelCategoria;
  tipoImovel: string;
  tipoImovelDescricao: string;
  servicoOutrosDescricao: string;

  // Campos específicos do pedido
  valorTotal: number;
  observacoes: string;

  // Atividades
  atividades: Atividade[];
}
