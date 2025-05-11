// /backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String,  },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  admin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});
/*
userSchema.pre('save', async function(next) {
  if (!this.isModified('pass')) return next();  // اصلاح نام فیلد به 'pass'
  const salt = await bcrypt.genSalt(10);
  this.pass = await bcrypt.hash(this.pass, salt); // تغییر به 'this.pass'
  next();
});
*/
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;