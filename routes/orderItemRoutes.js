const express = require('express');
const router = express.Router();
const pool = require('../src/config/db');

// ✅ Add item to order_items
router.post('/', async (req, res) => {
  try {
    const { order_id, product_name, quantity, price } = req.body;
    const result = await pool.query(
      'INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, product_name, quantity, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
