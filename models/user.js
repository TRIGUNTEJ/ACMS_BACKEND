//models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const userdetails= mongoose.model("users", userSchema);

module.exports = userdetails;