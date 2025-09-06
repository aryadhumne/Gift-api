const express = require("express");
const router = express.Router();
const pool = require("../src/config/db.js"); // PostgreSQL pool

// ================== CREATE ORDER ==================
router.post("/", async (req, res) => {
  // Accept both grandTotal (from frontend) and total_amount (backend consistency)
  const { customer_id, items, grandTotal, total_amount } = req.body;

  const total = grandTotal || total_amount; // normalize field name

  if (!customer_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into orders table
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total_amount, order_date)
       VALUES ($1, $2, NOW())
       RETURNING order_id`,
      [customer_id, total]
    );

    const order_id = orderResult.rows[0].order_id;

    // Insert each order item (using product_id only)
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "✅ Order placed successfully",
      order_id,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Database error (order):", err.message);
    res.status(500).json({ error: "Failed to place order", details: err.message });
  } finally {
    client.release();
  }
});

// ================== GET ALL ORDERS ==================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY order_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching orders:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ================== GET ORDER BY ID ==================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [id]);
    const items = await pool.query(
      `SELECT oi.*, p.product_name 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error("❌ Error fetching order:", err.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

module.exports = router;
