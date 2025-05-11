// /backend/models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
 firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  emergencyStatus: { type: String, required: true },
  department: { type: String, required: true },
  replacements: {
    replace1: {type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee'},
    replace2: {type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee'},
    replace3: {type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee'},
  }
});

const Employee=mongoose.model('Employee',employeeSchema);
module.exports = Employee;