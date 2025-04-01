-- Extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários admin
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_pessoa VARCHAR(50) NOT NULL, -- fisica ou juridica
  nome_responsavel VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  site VARCHAR(255),
  social_media VARCHAR(255),
  
  -- Endereço
  cep VARCHAR(10) NOT NULL,
  logradouro VARCHAR(255) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(255),
  bairro VARCHAR(255) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  
  -- Dados do pedido
  tipo_laudo VARCHAR(100) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  observacoes_internas TEXT,
  
  -- Status e datas
  status VARCHAR(50) CHECK (status IN ('aguardando_pagamento', 'pago', 'em_processo', 'concluido', 'cancelado')) DEFAULT 'aguardando_pagamento',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_atualizacao_por UUID REFERENCES usuarios(id)
);

-- Tabela de anexos
CREATE TABLE anexos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  nome_original VARCHAR(255) NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100) NOT NULL,
  tamanho INTEGER NOT NULL,
  data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de histórico de status
CREATE TABLE historico_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  status_anterior VARCHAR(50) NOT NULL,
  status_novo VARCHAR(50) NOT NULL,
  observacao TEXT,
  usuario_nome VARCHAR(255) NOT NULL DEFAULT 'Administrador',
  data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data_criacao ON pedidos(data_criacao);
CREATE INDEX idx_anexos_pedido ON anexos(pedido_id);
CREATE INDEX idx_historico_pedido ON historico_status(pedido_id);

-- Trigger para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedido_data_atualizacao
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_data_atualizacao();

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Admin',
  'admin@admin.com',
  '$2a$10$Q7GYi5RdxmF1OxF0URZKn.07ZYX3HxpIUz0DNh5D/dQh.U5.WXp2.',
  'admin'
);