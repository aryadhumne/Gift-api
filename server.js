const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); // PostgreSQL connection
const app = express();
const PORT = 5000;

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json()); // built-in JSON parser

// ----------------- Customer API -----------------
app.post('/api/customers', async (req, res) => {
  const { full_name, email } = req.body || {};

  if (!full_name || !email) {
    return res.status(400).json({ message: 'Full name and email are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers (full_name, email)
       VALUES ($1, $2)
       RETURNING customer_id, full_name, email`,
      [full_name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// ----------------- Orders API -----------------
app.post('/api/orders', async (req, res) => {
  const { customer_id, items, total_amount } = req.body;

  if (!customer_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Insert order
    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING order_id',
      [customer_id, total_amount]
    );

    const orderId = orderResult.rows[0].order_id;

    // 2️⃣ Insert order items
    const insertedItems = [];

    for (const item of items) {
      // fetch product name from products table
      const productRes = await client.query(
        'SELECT name FROM products WHERE id = $1',
        [item.product_id]
      );

      if (!productRes.rows[0]) {
        console.warn(`Skipping invalid product ID: ${item.product_id}`);
        continue; // skip invalid product
      }

      const productName = productRes.rows[0].name;

      const insertedItem = await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [orderId, item.product_id, productName, item.quantity, item.price]
      );

      insertedItems.push(insertedItem.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order placed successfully',
      order_id: orderId,
      items: insertedItems
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database error:', err.message);
    res.status(500).json({ message: 'Database error', error: err.message });
  } finally {
    client.release();
  }
});

// ----------------- Start Server -----------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

