// /backend/models/Scenario.js
const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  assets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }], // ارجاع به کالکشن assets
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }], // ارجاع به کالکشن resources
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }], // ارجاع به کالکشن employees
});

module.exports = mongoose.model('Scenario', scenarioSchema);
