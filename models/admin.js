//models/user.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});
const admindetails= mongoose.model("admins", adminSchema);

module.exports = admindetails;