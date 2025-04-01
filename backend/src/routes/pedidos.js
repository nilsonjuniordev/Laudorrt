const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // máximo de 10 arquivos
  }
});

const pedidoController = new PedidoController();

// Rotas
router.post('/', pedidoController.criar.bind(pedidoController));
router.get('/', pedidoController.listar.bind(pedidoController));
router.get('/:id', pedidoController.buscarPorId.bind(pedidoController));
router.put('/:id', pedidoController.atualizar.bind(pedidoController));
router.put('/:id/status', pedidoController.atualizarStatus.bind(pedidoController));
router.delete('/:id', pedidoController.excluir.bind(pedidoController));
router.get('/:id/planilha', pedidoController.downloadPlanilha.bind(pedidoController));
router.post('/:id/anexos', upload.array('files'), pedidoController.uploadAnexos.bind(pedidoController));
router.delete('/:id/anexos/:anexoId', pedidoController.excluirAnexo.bind(pedidoController));

module.exports = router; 