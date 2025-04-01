const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'laudorrt'
  },
  pool: {
    min: 2,
    max: 10
  }
});

module.exports = knex; 