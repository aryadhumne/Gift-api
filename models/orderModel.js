// models/orderModel.js
const pool = require('../src/config/db');

const Order = {
  async getAll() {
    const result = await pool.query('SELECT * FROM orders');
    return result.rows;
  },

  async create({ customer_id, order_date }) {
    const result = await pool.query(
      'INSERT INTO orders (customer_id, order_date) VALUES ($1, $2) RETURNING *',
      [customer_id, order_date]
    );
    return result.rows[0];
  }
};

module.exports = Order;
