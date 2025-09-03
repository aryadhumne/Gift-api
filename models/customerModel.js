// models/customerModel.js
const pool = require('../src/config/db');

const Customer = {
  async getAll() {
    const result = await pool.query('SELECT * FROM customers');
    return result.rows;
  },

  async create({ name, email }) {
    const result = await pool.query(
      'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  }
};

module.exports = Customer;
