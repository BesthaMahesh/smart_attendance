const Student = require('../models/Student');
const User = require('../models/User');

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ name: 1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  const { name, email, department, year } = req.body;
  if (!name || !email || !department || !year) {
    return res.status(400).json({ error: 'Name, email, department, and year are required' });
  }

  try {
    const studentExists = await Student.findOne({ email });
    const userExists = await User.findOne({ email });
    if (studentExists || userExists) {
      return res.status(400).json({ error: 'An account with this email address already exists in the system (e.g. Admin or existing user).' });
    }

    const generatedRollNumber = req.body.rollNumber || `STU-${Date.now().toString().slice(-6)}`;
    const student = new Student({ name, email, rollNumber: generatedRollNumber, department, year, attendancePercentage: 100 });
    await student.save();

    // Create a default User account for the student, password default is 'student123'
    const user = new User({
      email,
      password: 'student123',
      role: 'student',
      name,
      studentRef: student._id
    });
    await user.save();

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, year, attendancePercentage } = req.body;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (year) student.year = year;
    if (attendancePercentage !== undefined) student.attendancePercentage = attendancePercentage;

    await student.save();

    // Update user profile credentials if changed
    await User.findOneAndUpdate(
      { studentRef: student._id },
      { name: student.name, email: student.email }
    );

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Remove user logins
    await User.findOneAndDelete({ studentRef: id });

    res.status(200).json({ message: 'Student and associated user account deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOwnProfile = async (req, res) => {
  try {
    const studentId = req.user.studentRef;
    if (!studentId) {
      return res.status(400).json({ error: 'No student profile linked to this user' });
    }
    const { name, email, department, year, phone } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (year) student.year = year;
    if (phone !== undefined) student.phone = phone;

    await student.save();

    // Update user login credentials
    await User.findByIdAndUpdate(req.user._id, {
      name: student.name,
      email: student.email
    });

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOwnProfile = async (req, res) => {
  try {
    const studentId = req.user.studentRef;
    if (!studentId) {
      return res.status(400).json({ error: 'No student profile linked to this user' });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeOwnPassword = async (req, res) => {
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

const deleteOwnAccount = async (req, res) => {
  try {
    const studentId = req.user.studentRef;
    if (!studentId) {
      return res.status(400).json({ error: 'No student profile linked to this user' });
    }

    await Student.findByIdAndDelete(studentId);
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  updateOwnProfile,
  getOwnProfile,
  changeOwnPassword,
  deleteOwnAccount
};
