require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function recreateDatabase() {
  // Conexão com o postgres (sem banco específico)
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  try {
    // Dropar banco se existir
    await pool.query('DROP DATABASE IF EXISTS ' + process.env.DB_NAME);
    
    // Criar banco novamente
    await pool.query('CREATE DATABASE ' + process.env.DB_NAME);

    console.log('Banco de dados recriado com sucesso!');

    // Fechar conexão
    await pool.end();

    // Conectar ao banco específico
    const dbPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    // Ler e executar script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, '..', '..', 'database.sql'),
      'utf8'
    );

    await dbPool.query(sqlScript);
    console.log('Estrutura do banco de dados criada com sucesso!');

    await dbPool.end();
  } catch (error) {
    console.error('Erro ao recriar banco de dados:', error);
  }
}

// Executar recriação
recreateDatabase(); 