require('dotenv').config();
require('./config/init');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const adminRoutes = require('./routes/admin');
const pedidosRoutes = require('./routes/pedidos');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Log de requisições
app.use((req, res, next) => {
  console.log('Requisição recebida:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Servir arquivos estáticos
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rotas
app.use('/api/admin', adminRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 