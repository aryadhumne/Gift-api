const pool = require('../DB');

const createOrder = async (req, res) => {
  const { customer_id, total_amount, items } = req.body;

  if (!customer_id || total_amount == null || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // Insert into orders table including total_amount
    const orderResult = await pool.query(
      'INSERT INTO orders (customer_id, total_amount, order_date) VALUES ($1, $2, NOW()) RETURNING order_id',
      [customer_id, total_amount]
    );
    const order_id = orderResult.rows[0].order_id;

    // Insert order items
    const promises = items.map(item => {
      return pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order_id, item.product_id, item.quantity, item.price]
      );
    });
    await Promise.all(promises);

    res.json({ message: 'Order placed successfully', order_id });
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createOrder };
