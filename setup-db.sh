#!/bin/bash

# Conectar ao PostgreSQL e executar o script SQL
PGPASSWORD="Be111290@#" psql -h 147.79.83.158 -U postgres -f init.sql

# Verificar se o banco de dados foi criado com sucesso
if [ $? -eq 0 ]; then
    echo "Banco de dados criado com sucesso!"
else
    echo "Erro ao criar o banco de dados."
    exit 1
fi 