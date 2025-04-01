@echo off
set PGPASSWORD=Be111290@#
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d laudorrt -c "ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_status_check;"
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d laudorrt -c "ALTER TABLE pedidos ADD CONSTRAINT pedidos_status_check CHECK (status IN ('aguardando_pagamento', 'pago', 'em_processo', 'concluido', 'cancelado'));" 