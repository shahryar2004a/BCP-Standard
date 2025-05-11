// /backend/models/Responsibility.js

const mongoose = require('mongoose');

const responsibilitySchema = new mongoose.Schema({
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    responsibilities: [{ type: String, enum: ['responsible', 'consulted', 'informed', 'support'] }]
  });
  


module.exports = mongoose.model('Responsibility', responsibilitySchema);