// /backend/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true }, // مقدار یا تعداد
});

module.exports = mongoose.model('Resource', resourceSchema);
