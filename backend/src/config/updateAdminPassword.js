require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./database');

async function updateAdminPassword() {
  try {
    // Gerar novo hash da senha
    const senha = 'admin123';
    const senha_hash = await bcrypt.hash(senha, 10);

    // Atualizar senha do admin
    const result = await pool.query(
      'UPDATE usuarios SET senha_hash = $1 WHERE email = $2 RETURNING *',
      [senha_hash, 'admin@admin.com']
    );

    if (result.rows[0]) {
      console.log('Senha do admin atualizada com sucesso!');
      console.log('Email:', result.rows[0].email);
      console.log('Novo hash:', senha_hash);
    } else {
      console.log('Usuário admin não encontrado!');
    }

    // Fechar conexão
    await pool.end();
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
  }
}

// Executar atualização
updateAdminPassword(); 