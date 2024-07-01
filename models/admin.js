const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const AdminDetails = mongoose.model('Admin', AdminSchema);

module.exports = AdminDetails;
