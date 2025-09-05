const express = require('express');
const router = express.Router();
const pool = require('../src/config/db.js'); // import PostgreSQL pool

// Create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  )
`).catch(err => console.error('Error creating table:', err));

// POST /api/customers
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id',
      [name, email]
    );
    res.json({ message: 'Customer saved successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
