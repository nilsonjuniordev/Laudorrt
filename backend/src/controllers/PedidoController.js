const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { gerarQRCodePix } = require('../utils/pix');
const ExcelJS = require('exceljs');

const STATUS_PERMITIDOS = [
  'aguardando_pagamento',
  'pago',
  'em_processo',
  'concluido',
  'cancelado'
];

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).any();

class PedidoController {
  async criar(req, res) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.error('Erro no upload:', err);
          return res.status(400).json({ error: 'Erro no upload dos arquivos' });
        }

        try {
          // Extrair dados do JSON
          const dadosJSON = JSON.parse(req.body.data);
          console.log('Dados JSON recebidos:', dadosJSON);

          const pedidoId = uuidv4();
          
          // Preparar dados do pedido
          const pedidoData = {
            id: pedidoId,
            tipo_pessoa: dadosJSON.tipo_pessoa,
            nome_responsavel: dadosJSON.nome_responsavel,
            cpf_cnpj: dadosJSON.cpf_cnpj,
            email: dadosJSON.email,
            telefone: dadosJSON.telefone,
            site: dadosJSON.site || null,
            social_media: dadosJSON.social_media || null,
            
            // Endere��o do contratante
            cep: dadosJSON.cep,
            logradouro: dadosJSON.logradouro,
            numero: dadosJSON.numero,
            complemento: dadosJSON.complemento || null,
            bairro: dadosJSON.bairro,
            cidade: dadosJSON.cidade,
            estado: dadosJSON.estado,
            
            // Endereço da obra
            endereco_obra_igual: dadosJSON.endereco_obra_igual || false,
            cep_obra: dadosJSON.cep_obra,
            logradouro_obra: dadosJSON.logradouro_obra,
            numero_obra: dadosJSON.numero_obra,
            complemento_obra: dadosJSON.complemento_obra || null,
            bairro_obra: dadosJSON.bairro_obra,
            cidade_obra: dadosJSON.cidade_obra,
            estado_obra: dadosJSON.estado_obra,
            
            // Tipo de imóvel
            categoria_imovel: dadosJSON.categoria_imovel || 'RESIDENCIAL',
            tipo_imovel: dadosJSON.tipo_imovel || '',
            tipo_imovel_descricao: dadosJSON.tipo_imovel_descricao || null,
            
            // Campos específicos do pedido
            tipo_laudo: dadosJSON.tipo_laudo || 'RRT',
            valor_total: dadosJSON.valor_total || 0,
            observacoes: dadosJSON.observacoes || null,
            status: 'aguardando_pagamento',
            data_criacao: new Date(),
            data_atualizacao: new Date(),
            
            // Campos de pessoa jurídica
            razao_social: dadosJSON.razao_social || null,
            inscricao_estadual: dadosJSON.inscricao_estadual || null,
            cpf_responsavel: dadosJSON.cpf_responsavel || null
          };

          // Log dos dados que serão inseridos
          console.log('Dados do pedido a serem inseridos:', pedidoData);

          // Inserir pedido
          await db('pedidos').insert(pedidoData);

          // Processar atividades
          let atividadesCriadas = [];
          if (dadosJSON.atividades && Array.isArray(dadosJSON.atividades)) {
            console.log('Processando atividades:', dadosJSON.atividades);
            
            const atividadesData = dadosJSON.atividades.map(atividade => ({
              id: uuidv4(),
              pedido_id: pedidoId,
              tipo: atividade.tipo,
              tipo_projeto: atividade.tipo_projeto || atividade.tipoProjeto,
              tipo_execucao: atividade.tipo_execucao || atividade.tipoExecucao,
              quantidade_metros_quadrados: atividade.quantidade_metros_quadrados || atividade.quantidadeMetrosQuadrados,
              descricao_servico: atividade.descricao_servico || atividade.descricaoServico,
              precisa_art: atividade.precisa_art || atividade.precisaArt || false,
              precisa_memorial: atividade.precisa_memorial || atividade.precisaMemorial || false,
              precisa_projeto: atividade.precisa_projeto || atividade.precisaProjeto || false,
              precisa_execucao: atividade.precisa_execucao || atividade.precisaExecucao || false,
              valor_unitario: parseFloat(atividade.valor_unitario || atividade.valorUnitario) || 0,
              valor_total: parseFloat(atividade.valor_total || atividade.valorTotal) || 0,
              data_criacao: new Date()
            }));

            console.log('Dados das atividades a serem inseridos:', atividadesData);
            await db('atividades').insert(atividadesData);
            atividadesCriadas = atividadesData;

            // Processar anexos
            if (req.files && req.files.length > 0) {
              for (const file of req.files) {
                const [atividadeIndex, tipo, index] = file.fieldname.match(/atividades\[(\d+)\]\.(projeto|fotos)\[?(\d*)\]?/).slice(1);
                const atividade = atividadesData[parseInt(atividadeIndex)];

                const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
                const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
                
                fs.writeFileSync(filePath, file.buffer);

                const anexoData = {
                  id: uuidv4(),
                  pedido_id: pedidoId,
                  atividade_id: atividade.id,
                  nome_original: file.originalname,
                  nome_arquivo: fileName,
                  tipo_arquivo: file.mimetype,
                  tamanho: file.size,
                  tipo: tipo === 'projeto' ? 'projeto' : 'foto',
                  data_upload: new Date()
                };
                await db('anexos').insert(anexoData);
              }
            }
          }

          // Gerar QR Code do PIX
          const qrCodePix = await gerarQRCodePix(pedidoData.valor_total, pedidoId);
          console.log('QR Code PIX gerado:', qrCodePix);

          // Retornar dados completos do pedido
          const pedidoCriado = await db('pedidos').where({ id: pedidoId }).first();
          const atividades = await db('atividades').where({ pedido_id: pedidoId });
          const anexos = await db('anexos').where({ pedido_id: pedidoId });

          res.status(201).json({
            pedido: pedidoCriado,
            atividades,
            anexos,
            qr_code_pix: qrCodePix
          });
        } catch (error) {
          console.error('Erro detalhado ao criar pedido:', error);
          res.status(500).json({ error: 'Erro ao criar pedido' });
        }
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro ao processar upload' });
    }
  }

  async uploadAnexos(req, res) {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Erro no upload dos arquivos' });
      } else if (err) {
        return res.status(500).json({ error: 'Erro ao processar upload' });
      }

      const { id } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      try {
        for (const file of files) {
          await db('anexos').insert({
            id: uuidv4(),
            pedido_id: id,
            nome_original: file.originalname,
            nome_arquivo: file.filename,
            tipo_arquivo: file.mimetype,
            tamanho: file.size,
            data_upload: new Date()
          });
        }

        res.status(200).json({ message: 'Anexos enviados com sucesso' });
      } catch (error) {
        console.error('Erro ao salvar anexos no banco:', error);
        res.status(500).json({ error: 'Erro ao salvar anexos' });
      }
    });
  }

  async buscarPorId(req, res) {
    const { id } = req.params;

    try {
      const pedido = await db('pedidos').where({ id }).first();
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const anexos = await db('anexos').where({ pedido_id: id });
      const atividades = await db('atividades').where({ pedido_id: id });
      const historico = await db('historico_status').where({ pedido_id: id });

      // Gerar QR Code do PIX
      const valorTotal = typeof pedido.valor_total === 'string' ? 
        parseFloat(pedido.valor_total) : 
        Number(pedido.valor_total || 0);

      const qrCodePix = await gerarQRCodePix(valorTotal, id);
      console.log('QR Code PIX gerado na busca:', qrCodePix);

      res.json({
        pedido: {
          ...pedido,
          valor_total: valorTotal
        },
        anexos,
        atividades,
        historico,
        qr_code_pix: qrCodePix
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  async listar(req, res) {
    try {
      // Buscar todos os pedidos
      const pedidos = await db('pedidos')
        .select('*')
        .orderBy('data_criacao', 'desc');

      // Para cada pedido, buscar suas atividades e anexos
      const pedidosCompletos = await Promise.all(pedidos.map(async (pedido) => {
        const atividades = await db('atividades')
          .where({ pedido_id: pedido.id });
        
        const anexos = await db('anexos')
          .where({ pedido_id: pedido.id });
        
        const historico = await db('historico_status')
          .where({ pedido_id: pedido.id })
          .orderBy('data_alteracao', 'desc');

        return {
          ...pedido,
          atividades,
          anexos,
          historico
        };
      }));

      res.json(pedidosCompletos);
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  }

  async atualizarStatus(req, res) {
    const { id } = req.params;
    const { status, observacao, usuario_nome } = req.body;

    try {
      // Validar se o status é permitido
      if (!STATUS_PERMITIDOS.includes(status)) {
        return res.status(400).json({ 
          error: 'Status inválido',
          status_permitidos: STATUS_PERMITIDOS
        });
      }

      const pedido = await db('pedidos').where({ id }).first();
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Registrar histórico
      await db('historico_status').insert({
        id: uuidv4(),
        pedido_id: id,
        status_anterior: pedido.status,
        status_novo: status,
        observacao,
        usuario_nome: usuario_nome || 'Administrador',
        data_alteracao: new Date()
      });

      // Atualizar status
      await db('pedidos')
        .where({ id })
        .update({
          status,
          data_atualizacao: new Date()
        });

      res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  }

  async atualizar(req, res) {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    try {
      const pedido = await db('pedidos').where({ id }).first();
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Validar status se estiver sendo atualizado
      if (dadosAtualizacao.status && !STATUS_PERMITIDOS.includes(dadosAtualizacao.status)) {
        return res.status(400).json({ 
          error: 'Status inválido',
          status_permitidos: STATUS_PERMITIDOS
        });
      }

      // Remover campos relacionados que estão em outras tabelas
      const { atividades, anexos, historico, ...dadosPedido } = dadosAtualizacao;

      await db('pedidos')
        .where({ id })
        .update({
          ...dadosPedido,
          data_atualizacao: new Date()
        });

      res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }

  async excluirAnexo(req, res) {
    const { id, anexoId } = req.params;

    try {
      const anexo = await db('anexos')
        .where({ 
          id: anexoId, 
          pedido_id: id 
        })
        .first();

      if (!anexo) {
        return res.status(404).json({ error: 'Anexo não encontrado' });
      }

      // Excluir o arquivo físico
      const filePath = path.join(__dirname, '..', '..', 'uploads', anexo.nome_arquivo);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Erro ao excluir arquivo físico:', err);
      }

      // Excluir registro do banco
      await db('anexos')
        .where({ 
          id: anexoId, 
          pedido_id: id 
        })
        .del();

      res.json({ message: 'Anexo excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir anexo:', error);
      res.status(500).json({ error: 'Erro ao excluir anexo' });
    }
  }

  async excluir(req, res) {
    const { id } = req.params;

    try {
      // Buscar anexos do pedido
      const anexos = await db('anexos').where({ pedido_id: id });

      // Excluir arquivos físicos
      for (const anexo of anexos) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', anexo.nome_arquivo);
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Erro ao excluir arquivo físico:', err);
        }
      }

      // Excluir registros do banco
      await db('anexos').where({ pedido_id: id }).del();
      await db('atividades').where({ pedido_id: id }).del();
      await db('historico_status').where({ pedido_id: id }).del();
      await db('pedidos').where({ id }).del();

      res.json({ message: 'Pedido excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      res.status(500).json({ error: 'Erro ao excluir pedido' });
    }
  }

  async downloadAnexo(req, res) {
    const { id, anexoId } = req.params;

    try {
      const anexo = await db('anexos')
        .where({ id: anexoId, pedido_id: id })
        .first();

      if (!anexo) {
        return res.status(404).json({ error: 'Anexo não encontrado' });
      }

      const filePath = path.join(__dirname, '..', '..', 'uploads', anexo.nome_arquivo);
      res.download(filePath, anexo.nome_original);
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      res.status(500).json({ error: 'Erro ao baixar anexo' });
    }
  }

  async downloadPlanilha(req, res) {
    const { id } = req.params;

    try {
      // Buscar dados do pedido
      const pedido = await db('pedidos').where({ id }).first();
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const atividades = await db('atividades').where({ pedido_id: id });
      const anexos = await db('anexos').where({ pedido_id: id });
      const historico = await db('historico_status').where({ pedido_id: id });

      // Criar workbook e worksheet
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Sistema Laudorrt';
      workbook.created = new Date();

      // Planilha de Informações Gerais
      const wsInfo = workbook.addWorksheet('Informações Gerais');
      wsInfo.columns = [
        { header: 'Campo', key: 'campo', width: 20 },
        { header: 'Valor', key: 'valor', width: 40 }
      ];

      // Adicionar dados do pedido
      wsInfo.addRows([
        { campo: 'ID do Pedido', valor: pedido.id },
        { campo: 'Tipo de Pessoa', valor: pedido.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica' },
        { campo: 'Nome do Responsável', valor: pedido.nome_responsavel },
        { campo: 'CPF/CNPJ', valor: pedido.cpf_cnpj },
        { campo: 'Email', valor: pedido.email },
        { campo: 'Telefone', valor: pedido.telefone },
        { campo: 'Status', valor: pedido.status },
        { campo: 'Valor Total', valor: pedido.valor_total },
        { campo: 'Data de Criação', valor: new Date(pedido.data_criacao).toLocaleString() }
      ]);

      if (pedido.tipo_pessoa === 'juridica') {
        wsInfo.addRows([
          { campo: 'Razão Social', valor: pedido.razao_social },
          { campo: 'Inscrição Estadual', valor: pedido.inscricao_estadual },
          { campo: 'CPF do Responsável', valor: pedido.cpf_responsavel }
        ]);
      }

      // Adicionar endereço
      wsInfo.addRows([
        { campo: 'CEP', valor: pedido.cep },
        { campo: 'Logradouro', valor: pedido.logradouro },
        { campo: 'Número', valor: pedido.numero },
        { campo: 'Complemento', valor: pedido.complemento || '-' },
        { campo: 'Bairro', valor: pedido.bairro },
        { campo: 'Cidade', valor: pedido.cidade },
        { campo: 'Estado', valor: pedido.estado }
      ]);

      // Se tiver endereço da obra diferente
      if (!pedido.endereco_obra_igual) {
        wsInfo.addRows([
          { campo: 'CEP (Obra)', valor: pedido.cep_obra },
          { campo: 'Logradouro (Obra)', valor: pedido.logradouro_obra },
          { campo: 'Número (Obra)', valor: pedido.numero_obra },
          { campo: 'Complemento (Obra)', valor: pedido.complemento_obra || '-' },
          { campo: 'Bairro (Obra)', valor: pedido.bairro_obra },
          { campo: 'Cidade (Obra)', valor: pedido.cidade_obra },
          { campo: 'Estado (Obra)', valor: pedido.estado_obra }
        ]);
      }

      // Planilha de Atividades
      const wsAtividades = workbook.addWorksheet('Atividades');
      wsAtividades.columns = [
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Tipo de Projeto', key: 'tipo_projeto', width: 15 },
        { header: 'Tipo de Execução', key: 'tipo_execucao', width: 15 },
        { header: 'Quantidade (m²)', key: 'quantidade_metros_quadrados', width: 15 },
        { header: 'Descrição', key: 'descricao_servico', width: 40 },
        { header: 'Valor Unitário', key: 'valor_unitario', width: 15 },
        { header: 'Valor Total', key: 'valor_total', width: 15 }
      ];

      wsAtividades.addRows(atividades);

      // Planilha de Histórico
      const wsHistorico = workbook.addWorksheet('Histórico');
      wsHistorico.columns = [
        { header: 'Data', key: 'data_alteracao', width: 20 },
        { header: 'Usuário', key: 'usuario_nome', width: 20 },
        { header: 'Status Anterior', key: 'status_anterior', width: 20 },
        { header: 'Novo Status', key: 'status_novo', width: 20 },
        { header: 'Observação', key: 'observacao', width: 40 }
      ];

      wsHistorico.addRows(historico.map(h => ({
        ...h,
        data_alteracao: new Date(h.data_alteracao).toLocaleString()
      })));

      // Planilha de Anexos
      const wsAnexos = workbook.addWorksheet('Anexos');
      wsAnexos.columns = [
        { header: 'Nome Original', key: 'nome_original', width: 40 },
        { header: 'Tipo', key: 'tipo_arquivo', width: 20 },
        { header: 'Tamanho', key: 'tamanho', width: 15 },
        { header: 'Data Upload', key: 'data_upload', width: 20 }
      ];

      wsAnexos.addRows(anexos.map(a => ({
        ...a,
        tamanho: `${(Number(a.tamanho) / 1024 / 1024).toFixed(2)} MB`,
        data_upload: new Date(a.data_upload).toLocaleString()
      })));

      // Configurar cabeçalhos para download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=pedido-${id}.xlsx`
      );

      // Enviar arquivo
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Erro ao gerar planilha:', error);
      res.status(500).json({ error: 'Erro ao gerar planilha' });
    }
  }
}

// Exportar uma instância da classe
module.exports = PedidoController; 