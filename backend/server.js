

/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assetRouter=require('./routes/assetRoutes')
const employeeRouter=require('./routes/employeeRoutes')

const app = express();
app.use(express.json());
app.use(cors());

// اتصال به دیتابیس MongoDB
mongoose.connect('mongodb://localhost:27017/BCP_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB: ', error));



app.use('/api/assets',assetRouter)
app.use('/api/employees',employeeRouter)

  
const port =process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const assetRoutes = require('./routes/assetRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes=require('./routes/resourceRoutes');
const responsibilityRoutes=require('./routes/responsibilityRoutes')
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const crisisRoutes = require('./routes/crisisRoutes');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/responsibility',responsibilityRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/employees-by-responsibility',crisisRoutes)
// Start server
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
