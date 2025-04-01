export type TipoPessoa = 'fisica' | 'juridica';

export type TipoImovelCategoria = 'RESIDENCIAL' | 'COMERCIAL' | 'OUTROS';

export type TipoImovel = {
  categoria: TipoImovelCategoria;
  tipo: 'APARTAMENTO' | 'CASA' | 'SALA COMERCIAL' | 'DESCREVER';
};

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
  | 'EXECUÇÃO DE INSTALAÇÃO DE REVESTIMENTOS CERÂMICOS'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PORCELANATO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE PISO DE MADEIRA'
  | 'EXECUÇÃO DE ADEQUAÇÃO DE ACESSIBILIDADE'
  | 'EXECUÇÃO DE ESTRUTURA DE MADEIRA'
  | 'EXECUÇÃO DE ESTRUTURA DE CONCRETO'
  | 'EXECUÇÃO DE ESTRUTURA METÁLICA'
  | 'EXECUÇÃO DE ESTRUTURAS MISTAS'
  | 'EXECUÇÃO DE OUTRAS ESTRUTURAS'
  | 'EXECUÇÃO DE INSTALAÇÕES LUMINOTECNICAS'
  | 'EXECUÇÃO DE INSTALAÇÕES DE CONDICIONAMENTO ACUSTICO'
  | 'EXECUÇÃO DE SONORIZAÇÃO'
  | 'EXECUÇÃO DE INSTALAÇÃO DE SISTEMAS DE VENTILAÇÃO, EXAUSTÃO E CLIMATIZAÇÃO'
  | 'EXECUÇÃO DE OBRA DE INTERIORES'
  | 'EXECUÇÃO DE REFORMA DE INTERIORES'
  | 'EXECUÇÃO DE MOBILIÁRIO'
  | 'EXECUÇÃO DE INSTALAÇÕES HIDROSANITÁRIAS PREDIAIS'
  | 'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE AGUAS PLUVIAIS'
  | 'EXECUÇÃO DE INSTALAÇÕES PREDIAIS DE GÁS CANALIZADO'
  | 'EXECUÇÃO DE INSTALAÇÕES ELETRICAS PREDIAIS DE BAIXA TENSÃO'
  | 'EXECUÇÃO DE COMUNICAÇÃO VISUAL PARA EDIFICAÇÕES'
  | 'EXECUÇÃO DE OBRA DE ARQUITETURA PAISAGISTICA';

export type TipoServico =
  | 'AR CONDICIONADO'
  | 'SERRALHERIA'
  | 'VIDRAÇARIA'
  | 'GESSEIRO'
  | 'MARMORARIA'
  | 'CONSTRUTORA'
  | 'OUTROS';

export type TipoAtividade = 'PROJETO' | 'EXECUCAO';

export interface Atividade {
  tipo: string;
  tipoProjeto?: string;
  tipoExecucao?: string;
  quantidadeMetrosQuadrados?: number;
  descricaoServico?: string;
  projeto?: File;
  fotos?: File[];
  precisaArt: boolean;
  precisaMemorial: boolean;
  precisaProjeto: boolean;
  precisaExecucao: boolean;
  faseProjeto?: 'inicial' | 'desenvolvimento' | 'final';
  tipoExecucaoObra?: 'reforma' | 'construcao' | 'ampliacao';
  valorUnitario: number;
  valorTotal: number;
}

export interface FormState {
  // Dados do Contratante
  tipoPessoa: TipoPessoa;
  nome: string;
  cpf: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  email: string;
  telefone: string;
  site: string;
  redesSociais: string;

  // Endereço do Contratante
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;

  // Endereço da Obra
  cepObra: string;
  logradouroObra: string;
  numeroObra: string;
  complementoObra: string;
  bairroObra: string;
  cidadeObra: string;
  estadoObra: string;

  // Tipo de Imóvel
  tipoImovelDescricao: string;

  // Serviços
  servicoOutrosDescricao: string;

  // Atividades
  atividades: Atividade[];

  // Observações
  observacoes: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
