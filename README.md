# Laudo RRT - Sistema de Gestão de Laudos e Projetos

## 📋 Sobre o Projeto

O Laudo RRT é um sistema web completo para gestão de laudos técnicos, projetos e execuções de obras. A plataforma permite o gerenciamento de pedidos, clientes e documentação técnica, com suporte a diferentes tipos de atividades como projetos arquitetônicos, execuções de obras e serviços relacionados.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com SSR e otimizações de performance
- **TypeScript**: Tipagem estática para maior segurança do código
- **Material-UI**: Biblioteca de componentes para interface moderna
- **Axios**: Cliente HTTP para comunicação com a API
- **React Hook Form**: Gerenciamento de formulários
- **JWT**: Autenticação baseada em tokens

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **PostgreSQL**: Banco de dados relacional
- **Prisma**: ORM para gerenciamento do banco de dados
- **JWT**: Autenticação e autorização
- **Multer**: Upload de arquivos
- **ExcelJS**: Geração de planilhas

### Infraestrutura
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers
- **Nginx**: Proxy reverso (quando necessário)

## 🏗️ Arquitetura

O sistema utiliza uma arquitetura em três camadas:
1. **Frontend (Porta 3008)**: Interface do usuário
2. **Backend (Porta 3009)**: API RESTful
3. **Banco de Dados (Porta 5432)**: PostgreSQL

## 💻 Funcionalidades Principais

### Gestão de Pedidos
- Criação de pedidos com múltiplas atividades
- Suporte a projetos e execuções
- Upload de arquivos e fotos
- Geração de planilhas
- Acompanhamento de status

### Tipos de Projetos Suportados
- Levantamento Arquitetônico
- Projeto Arquitetônico
- Projeto de Reforma
- Projeto de Adequação
- Projetos Estruturais (Madeira, Concreto, Metálica)
- Projetos de Instalações
- Projetos Paisagísticos

### Tipos de Execução Suportados
- Execução de Obras
- Reformas
- Instalações Diversas
- Execução de Revestimentos
- Execução de Estruturas
- Execução de Instalações

### Área Administrativa
- Dashboard com métricas
- Gestão de clientes
- Gestão de pedidos
- Controle de status
- Geração de relatórios

## 🔐 Autenticação e Segurança

- Login baseado em JWT
- Proteção de rotas administrativas
- Validação de formulários
- Sanitização de dados
- Controle de acesso baseado em roles

## 💰 Sistema de Pagamento

- Integração com PIX
- Geração de QR Code
- Acompanhamento de status de pagamento
- Cálculo automático de valores

## 📦 Estrutura de Arquivos

\`\`\`
laudorrt/
├── frontend/               # Aplicação Next.js
│   ├── pages/             # Páginas da aplicação
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços e API
│   │   └── types/         # Definições de tipos
│   └── public/            # Arquivos estáticos
├── backend/               # API Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de dados
│   │   ├── routes/        # Rotas da API
│   │   └── services/      # Lógica de negócio
│   └── prisma/            # Schemas do banco
└── docker/                # Configurações Docker
\`\`\`

## 🚀 Deploy

### Pré-requisitos
- Docker
- Docker Compose
- Node.js 18+
- PostgreSQL 14+

### Configuração do Ambiente

1. Clone o repositório:
\`\`\`bash
git clone [url-do-repositorio]
cd laudorrt
\`\`\`

2. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
\`\`\`

3. Inicie os containers:
\`\`\`bash
docker-compose up -d
\`\`\`

### Portas Utilizadas
- Frontend: 3008
- Backend: 3009
- PostgreSQL: 5432

## 📝 API Endpoints

### Autenticação
- `POST /api/admin/login`: Login administrativo
- `POST /api/admin/logout`: Logout

### Pedidos
- `GET /api/pedidos`: Lista todos os pedidos
- `POST /api/pedidos`: Cria novo pedido
- `GET /api/pedidos/:id`: Busca pedido por ID
- `PUT /api/pedidos/:id`: Atualiza pedido
- `DELETE /api/pedidos/:id`: Remove pedido

### Anexos
- `POST /api/pedidos/:id/anexos`: Upload de anexos
- `GET /api/pedidos/:id/anexos/:anexoId`: Download de anexo
- `DELETE /api/pedidos/:id/anexos/:anexoId`: Remove anexo

### Relatórios
- `GET /api/pedidos/:id/planilha`: Gera planilha do pedido

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Desenvolvedor

Nilson Junior 

## 📞 Suporte

Para suporte, envie um email para [nilson.be@gmail.com] ou abra uma issue no repositório. 