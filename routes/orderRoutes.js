const express = require('express');
const router = express.Router();
const pool = require('../src/config/db'); // adjust if needed

// ✅ Create order
router.post('/', async (req, res) => {
  try {
    const { customer_id } = req.body;
    const result = await pool.query(
      'INSERT INTO orders (customer_id) VALUES ($1) RETURNING order_id',
      [customer_id]
    );
    res.json(result.rows[0]);  // { order_id: 123 }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
