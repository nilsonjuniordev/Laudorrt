@echo off
set PGPASSWORD=Be111290@#
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d laudorrt -c "DROP TABLE historico_status;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d laudorrt -c "CREATE TABLE historico_status (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE, status_anterior VARCHAR(50) NOT NULL, status_novo VARCHAR(50) NOT NULL, observacao TEXT, usuario_nome VARCHAR(255) NOT NULL DEFAULT 'Administrador', data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP);" 