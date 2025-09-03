// src/config/db.js
const { Pool } = require('pg');

// ⚠️ Update with your pgAdmin/PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gift_api',
  password: 'admin@123',
  port: 5432, // default PostgreSQL port
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL!'))
  .catch(err => console.error('❌ DB connection failed:', err));

module.exports = pool;
