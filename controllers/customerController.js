const db = require("../src/config/db");

// ✅ Get all customers
const getCustomers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Add a new customer
const addCustomer = async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: "fullName and email are required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO customers (fullName, email)
       VALUES ($1, $2) RETURNING *`,
      [fullName, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting customer:", err);
    res.status(500).json({ error: "Database insert error" });
  }
};

module.exports = { getCustomers, addCustomer };
