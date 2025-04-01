# Backend Laudo RRT

Backend do sistema de gerenciamento de laudos RRT.

## Requisitos

- Node.js >= 14
- PostgreSQL >= 12

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Crie o banco de dados PostgreSQL:
```sql
CREATE DATABASE laudorrt;
```

5. Execute as migrações do banco de dados:
```bash
psql -U seu_usuario -d laudorrt -f database.sql
```

## Desenvolvimento

Para iniciar o servidor em modo desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

## Produção

Para iniciar o servidor em modo produção:

```bash
npm start
```

## Rotas da API

### Autenticação

- `POST /api/admin/login` - Login de administrador

### Dashboard

- `GET /api/admin/dashboard` - Dados do dashboard

### Pedidos (Admin)

- `GET /api/admin/pedidos` - Lista de pedidos
- `GET /api/admin/pedidos/:id` - Detalhes do pedido
- `PUT /api/admin/pedidos/:id/status` - Atualiza status do pedido
- `PUT /api/admin/pedidos/:id` - Atualiza dados do pedido
- `DELETE /api/admin/pedidos/:id` - Remove pedido

### Usuários

- `GET /api/admin/usuarios` - Lista de usuários
- `POST /api/admin/usuarios` - Cria novo usuário
- `PUT /api/admin/usuarios/:id` - Atualiza usuário
- `DELETE /api/admin/usuarios/:id` - Remove usuário

### Pedidos (Público)

- `POST /api/pedidos` - Cria novo pedido
- `GET /api/pedidos` - Lista pedidos
- `GET /api/pedidos/:id` - Detalhes do pedido
- `PUT /api/pedidos/:id` - Atualiza pedido
- `DELETE /api/pedidos/:id` - Remove pedido

### Anexos

- `POST /api/pedidos/:id/anexos` - Upload de anexos
- `DELETE /api/pedidos/:id/anexos/:anexoId` - Remove anexo

## Uploads

Os arquivos enviados são armazenados no diretório `uploads/` e podem ser acessados através da rota `/uploads/nome-do-arquivo`.

## Testes

Para executar os testes:

```bash
npm test
``` 