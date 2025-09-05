const db = require('../src/config/db');

const OrderItem = {
  async create(order_id, product_name, quantity, price) {
    const result = await db.query(
      'INSERT INTO order_items (order_id, product_name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, product_name, quantity, price]
    );
    return result.rows[0];
  },

  async findByOrder(order_id) {
    const result = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order_id]
    );
    return result.rows;
  }
};

module.exports = OrderItem;
