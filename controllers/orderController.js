const db = require('../src/config/db');

// Get all orders
const getOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add order
const addOrder = async (req, res) => {
  const { customer_id, order_date, total_amount } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO orders (customer_id, order_date, total_amount) VALUES ($1, $2, $3) RETURNING *',
      [customer_id, order_date, total_amount]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getOrders, addOrder };
