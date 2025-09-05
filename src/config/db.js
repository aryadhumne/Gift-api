const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',       
  password: 'admin@123',
  database: 'gift_api',     
  port: 5432                  
});

// Test connection
pool.connect((err, client, release) => {
  if (err) console.error('PostgreSQL connection error', err.stack);
  else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

module.exports = pool;
