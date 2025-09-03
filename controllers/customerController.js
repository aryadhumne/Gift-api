// controllers/customerController.js
const db = require('../src/config/db');

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add customer
const addCustomer = async (req, res) => {
  const { full_name, email, phone } = req.body;  // ✅ use full_name, not name
  try {
    const result = await db.query(
      'INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCustomers, addCustomer };
