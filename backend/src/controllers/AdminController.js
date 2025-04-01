const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class AdminController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await db('usuarios')
        .where({ email })
        .first();

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'sua_chave_secreta',
        { expiresIn: '24h' }
      );

      // Atualizar último login
      await db('usuarios')
        .where({ id: usuario.id })
        .update({
          ultimo_login: new Date()
        });

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }

  async logout(req, res) {
    // Como estamos usando JWT, o logout é feito no cliente
    res.json({ message: 'Logout realizado com sucesso' });
  }

  async getProfile(req, res) {
    try {
      const usuario = await db('usuarios')
        .where({ id: req.usuario.id })
        .select('id', 'nome', 'email', 'role', 'data_criacao', 'ultimo_login')
        .first();

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  async updateProfile(req, res) {
    try {
      const { nome, email, senha_atual, nova_senha } = req.body;
      const usuarioId = req.usuario.id;

      const usuario = await db('usuarios')
        .where({ id: usuarioId })
        .first();

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Se estiver alterando a senha
      if (senha_atual && nova_senha) {
        const senhaCorreta = await bcrypt.compare(senha_atual, usuario.senha_hash);
        if (!senhaCorreta) {
          return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        const senha_hash = await bcrypt.hash(nova_senha, 10);
        await db('usuarios')
          .where({ id: usuarioId })
          .update({ senha_hash });
      }

      // Atualizar dados básicos
      await db('usuarios')
        .where({ id: usuarioId })
        .update({
          nome: nome || usuario.nome,
          email: email || usuario.email
        });

      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  async getDashboardData(req, res) {
    try {
      // Buscar estatísticas dos pedidos
      const totalPedidos = await db('pedidos').count('* as total').first();
      const pedidosHoje = await db('pedidos')
        .where('data_criacao', '>=', new Date().setHours(0, 0, 0, 0))
        .count('* as total')
        .first();
      
      const valorTotal = await db('pedidos')
        .sum('valor_total as total')
        .first();
      
      const pedidosPorStatus = await db('pedidos')
        .select('status')
        .count('* as total')
        .groupBy('status');

      // Buscar últimos pedidos
      const ultimosPedidos = await db('pedidos')
        .select('*')
        .orderBy('data_criacao', 'desc')
        .limit(5);

      res.json({
        estatisticas: {
          total_pedidos: totalPedidos.total,
          pedidos_hoje: pedidosHoje.total,
          valor_total: valorTotal.total || 0,
          pedidos_por_status: pedidosPorStatus
        },
        ultimos_pedidos: ultimosPedidos
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
  }
}

module.exports = AdminController; 