const mongoose = require('mongoose');
const checkEmail = require('../utils/validate');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: [checkEmail, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
 }
});

module.exports = mongoose.model('User', UserSchema);