const db = require('../src/config/db'); // keep path consistent

// Get all order items
const getOrderItems = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM order_items');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching order items:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add item(s) to an order
const addOrderItem = async (req, res) => {
  const { order_id, product_name, quantity, price } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: "order_id is required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO order_items (order_id, product_name, quantity, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, product_name, quantity, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting order item:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getOrderItems, addOrderItem };
