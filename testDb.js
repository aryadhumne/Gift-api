// testDb.js
const pool = require('./src/config/db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL test query success:', res.rows[0]);
  } catch (err) {
    console.error('❌ Test query failed:', err);
  } finally {
    pool.end();
  }
})();
