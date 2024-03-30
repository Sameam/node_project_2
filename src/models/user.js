const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: Number, unique: true, sparse: true },
  admin: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

userSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 