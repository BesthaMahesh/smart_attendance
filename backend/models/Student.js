const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  attendancePercentage: { type: Number, default: 100 },
  phone: { type: String, default: '+1 (555) 019-2834' },
  faceEmbedding: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
