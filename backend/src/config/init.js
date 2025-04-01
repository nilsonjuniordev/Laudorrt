const fs = require('fs');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Criar diretório de uploads se não existir
const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function initDatabase() {
  try {
    // Verificar se as tabelas já existem
    const hasUsuarios = await db.schema.hasTable('usuarios');
    const hasPedidos = await db.schema.hasTable('pedidos');
    const hasAtividades = await db.schema.hasTable('atividades');
    const hasAnexos = await db.schema.hasTable('anexos');
    const hasHistoricoStatus = await db.schema.hasTable('historico_status');

    // Criar tabelas apenas se não existirem
    if (!hasUsuarios) {
      await db.schema.createTable('usuarios', table => {
        table.uuid('id').primary();
        table.string('nome').notNullable();
        table.string('email').notNullable().unique();
        table.string('senha_hash').notNullable();
        table.enum('role', ['admin', 'usuario']).defaultTo('usuario');
        table.timestamp('data_criacao').defaultTo(db.fn.now());
        table.timestamp('ultimo_login');
      });

      // Criar usuário admin padrão apenas se a tabela foi criada
      const senha_hash = await bcrypt.hash('admin123', 10);
      await db('usuarios').insert({
        id: uuidv4(),
        nome: 'Admin',
        email: 'admin@admin.com',
        senha_hash,
        role: 'admin',
        data_criacao: new Date()
      });
      console.log('Usuário admin criado com sucesso!');
    }

    if (!hasPedidos) {
      await db.schema.createTable('pedidos', table => {
        // Campos de identificação
        table.uuid('id').primary();
        table.enum('tipo_pessoa', ['fisica', 'juridica']).notNullable();
        table.timestamp('data_criacao').defaultTo(db.fn.now());
        table.timestamp('data_atualizacao').defaultTo(db.fn.now());
        
        // Campos comuns
        table.string('nome_responsavel').notNullable();
        table.string('cpf_cnpj').notNullable();
        table.string('email').notNullable();
        table.string('telefone').notNullable();
        table.string('site');
        table.text('social_media');
        
        // Endereço do contratante
        table.string('cep').notNullable();
        table.string('logradouro').notNullable();
        table.string('numero').notNullable();
        table.string('complemento');
        table.string('bairro').notNullable();
        table.string('cidade').notNullable();
        table.string('estado', 2).notNullable();
        
        // Endereço da obra
        table.boolean('endereco_obra_igual').defaultTo(false);
        table.string('cep_obra');
        table.string('logradouro_obra');
        table.string('numero_obra');
        table.string('complemento_obra');
        table.string('bairro_obra');
        table.string('cidade_obra');
        table.string('estado_obra', 2);
        
        // Tipo de imóvel
        table.string('categoria_imovel').notNullable();
        table.string('tipo_imovel').notNullable();
        table.text('tipo_imovel_descricao');
        
        // Campos específicos do pedido
        table.string('tipo_laudo').notNullable();
        table.decimal('valor_total', 10, 2).notNullable();
        table.text('observacoes');
        table.enum('status', [
          'em_analise',
          'aguardando_pagamento',
          'pago',
          'em_execucao',
          'concluido',
          'cancelado'
        ]).defaultTo('em_analise');
        
        // Campos adicionais para pessoa jurídica
        table.string('razao_social');
        table.string('inscricao_estadual');
        table.string('cpf_responsavel');
      });
    }

    if (!hasAtividades) {
      await db.schema.createTable('atividades', table => {
        table.uuid('id').primary();
        table.uuid('pedido_id').references('id').inTable('pedidos').onDelete('CASCADE');
        table.timestamp('data_criacao').defaultTo(db.fn.now());
        
        // Campos da atividade
        table.string('tipo').notNullable();
        table.string('tipo_projeto');
        table.string('tipo_execucao');
        table.decimal('quantidade_metros_quadrados', 10, 2);
        table.text('descricao_servico');
        
        // Serviços adicionais
        table.boolean('precisa_art').defaultTo(false);
        table.boolean('precisa_memorial').defaultTo(false);
        table.boolean('precisa_projeto').defaultTo(false);
        table.boolean('precisa_execucao').defaultTo(false);
        
        // Valores
        table.decimal('valor_unitario', 10, 2).notNullable();
        table.decimal('valor_total', 10, 2).notNullable();
      });
    }

    if (!hasAnexos) {
      await db.schema.createTable('anexos', table => {
        table.uuid('id').primary();
        table.uuid('pedido_id').references('id').inTable('pedidos').onDelete('CASCADE');
        table.uuid('atividade_id').references('id').inTable('atividades').onDelete('CASCADE');
        table.timestamp('data_upload').defaultTo(db.fn.now());
        
        // Informações do arquivo
        table.string('nome_original').notNullable();
        table.string('nome_arquivo').notNullable();
        table.string('tipo_arquivo').notNullable();
        table.bigInteger('tamanho').notNullable();
        table.enum('tipo', ['projeto', 'foto']).notNullable();
      });
    }

    if (!hasHistoricoStatus) {
      await db.schema.createTable('historico_status', table => {
        table.uuid('id').primary();
        table.uuid('pedido_id').references('id').inTable('pedidos').onDelete('CASCADE');
        table.timestamp('data_alteracao').defaultTo(db.fn.now());
        table.string('status_anterior').notNullable();
        table.string('status_novo').notNullable();
        table.text('observacao');
        table.string('usuario_nome').notNullable().defaultTo('Administrador');
      });
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Executar inicialização
initDatabase();

module.exports = {
  uploadDir
}; 