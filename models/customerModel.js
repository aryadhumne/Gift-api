const db = require('../src/config/db');

const Customer = {
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM customers WHERE email = $1', [email]);
    return result.rows[0];
  },

  async create(full_name, email, phone) {
    const result = await db.query(
      'INSERT INTO customers (full_name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [full_name, email, phone]
    );
    return result.rows[0];
  }
};

module.exports = Customer;
