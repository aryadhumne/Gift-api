const db = require('../src/config/db');

// Create Order
const createOrder = async (req, res) => {
  const { customer_id, total_amount } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING *',
      [customer_id, total_amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Orders
const getOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getOrders };
