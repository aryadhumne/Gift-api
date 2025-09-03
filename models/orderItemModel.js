// models/orderItemModel.js
const pool = require('../src/config/db');

const OrderItem = {
  async getAll() {
    const result = await pool.query('SELECT * FROM order_items');
    return result.rows;
  },

  async create({ order_id, product_name, quantity }) {
    const result = await pool.query(
      'INSERT INTO order_items (order_id, product_name, quantity) VALUES ($1, $2, $3) RETURNING *',
      [order_id, product_name, quantity]
    );
    return result.rows[0];
  }
};

module.exports = OrderItem;
