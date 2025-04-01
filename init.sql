-- Criar o banco de dados
CREATE DATABASE laudorrt;

-- Conectar ao banco de dados
\c laudorrt;

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Garantir que o usuário postgres tenha todos os privilégios
GRANT ALL PRIVILEGES ON DATABASE laudorrt TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres; 