const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:8100' }));
app.use(express.json());

// Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
