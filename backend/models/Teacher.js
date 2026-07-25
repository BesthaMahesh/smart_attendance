const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  phone: { type: String, default: '+1 (555) 012-3456' },
  faceEmbedding: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
