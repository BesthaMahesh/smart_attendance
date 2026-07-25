const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecretjwtkey_987654321', {
    expiresIn: '7d',
  });
};

const callPythonFaceService = async (endpoint, data) => {
  try {
    const faceServiceUrl = process.env.FACE_SERVICE_URL || 'http://localhost:8000';
    const res = await axios.post(`${faceServiceUrl}${endpoint}`, data);
    return res.data;
  } catch (err) {
    console.error(`Error calling Python face service at ${endpoint}:`, err.message);
    throw new Error('Face recognition service is currently offline. Please ensure Python service is running.');
  }
};

const faceLogin = async (req, res) => {
  const { probe, role } = req.body;

  if (!probe || !role) {
    return res.status(400).json({ error: 'Probe webcam frame and role are required' });
  }

  try {
    let candidates = [];
    if (role === 'student') {
      candidates = await Student.find({ faceEmbedding: { $exists: true, $not: { $size: 0 } } });
    } else if (role === 'teacher') {
      candidates = await Teacher.find({ faceEmbedding: { $exists: true, $not: { $size: 0 } } });
    } else {
      return res.status(400).json({ error: 'Invalid portal role specified' });
    }

    if (candidates.length === 0) {
      return res.status(404).json({ error: `No registered face profiles found for: ${role}` });
    }

    const formattedCandidates = candidates.map(c => ({
      id: c._id.toString(),
      embedding: c.faceEmbedding
    }));

    const matchResult = await callPythonFaceService('/compare-faces', {
      probe,
      candidates: formattedCandidates,
      threshold: 0.6
    });

    if (!matchResult.match) {
      return res.status(401).json({ error: 'Face not recognized. Please register first.' });
    }

    const matchedId = matchResult.match;
    let user = null;

    if (role === 'student') {
      user = await User.findOne({ studentRef: matchedId }).populate('studentRef');
      if (!user) {
        const student = await Student.findById(matchedId);
        user = new User({
          email: student.email,
          password: Math.random().toString(36),
          role: 'student',
          name: student.name,
          studentRef: student._id
        });
        await user.save();
      }
    } else {
      user = await User.findOne({ teacherRef: matchedId }).populate('teacherRef');
      if (!user) {
        const teacher = await Teacher.findById(matchedId);
        user = new User({
          email: teacher.email,
          password: Math.random().toString(36),
          role: 'teacher',
          name: teacher.name,
          teacherRef: teacher._id
        });
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentRef ? user.studentRef._id : null,
        teacherId: user.teacherRef ? user.teacherRef._id : null,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerStudentFace = async (req, res) => {
  const { name, rollNumber, email, department, year, images } = req.body;

  if (!name || !rollNumber || !email || !department || !year || !images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'All fields and captured face samples are required' });
  }

  try {
    const studentExists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
    if (studentExists) {
      return res.status(400).json({ error: 'Student with this email or roll number already exists' });
    }

    const pythonResult = await callPythonFaceService('/compute-embedding', { images });
    const faceEmbedding = pythonResult.embedding;

    const student = new Student({
      name,
      email,
      rollNumber,
      department,
      year,
      attendancePercentage: 100,
      faceEmbedding
    });
    await student.save();

    const user = new User({
      email,
      password: Math.random().toString(36),
      role: 'student',
      name,
      studentRef: student._id
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: student._id,
        teacherId: null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerTeacherFace = async (req, res) => {
  const { name, employeeId, email, department, subject, images } = req.body;

  if (!name || !employeeId || !email || !department || !subject || !images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'All fields and captured face samples are required' });
  }

  try {
    const teacherExists = await Teacher.findOne({ $or: [{ email }, { employeeId }] });
    if (teacherExists) {
      return res.status(400).json({ error: 'Teacher with this email or employee ID already exists' });
    }

    const pythonResult = await callPythonFaceService('/compute-embedding', { images });
    const faceEmbedding = pythonResult.embedding;

    const teacher = new Teacher({
      name,
      email,
      employeeId,
      department,
      subject,
      faceEmbedding
    });
    await teacher.save();

    const user = new User({
      email,
      password: Math.random().toString(36),
      role: 'teacher',
      name,
      teacherRef: teacher._id
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: null,
        teacherId: teacher._id
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).populate('studentRef').populate('teacherRef');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentRef ? user.studentRef._id : null,
        teacherId: user.teacherRef ? user.teacherRef._id : null,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdminAccount = async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last remaining administrator account.' });
    }

    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Administrator account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, faceLogin, registerStudentFace, registerTeacherFace, changeAdminPassword, deleteAdminAccount };
