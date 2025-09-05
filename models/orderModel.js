const db = require('../src/config/db');

const Order = {
  async create(customer_id) {
    const result = await db.query(
      'INSERT INTO orders (customer_id) VALUES ($1) RETURNING *',
      [customer_id]
    );
    return result.rows[0];
  },

  async findByCustomer(customer_id) {
    const result = await db.query(
      'SELECT * FROM orders WHERE customer_id = $1',
      [customer_id]
    );
    return result.rows;
  }
};

module.exports = Order;
