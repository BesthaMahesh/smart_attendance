const Teacher = require('../models/Teacher');
const User = require('../models/User');

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}).sort({ name: 1 });
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTeacher = async (req, res) => {
  const { name, email, subject } = req.body;
  if (!name || !email || !subject) {
    return res.status(400).json({ error: 'Name, email, and subject are required' });
  }

  try {
    const teacherExists = await Teacher.findOne({ email });
    const userExists = await User.findOne({ email });
    if (teacherExists || userExists) {
      return res.status(400).json({ error: 'An account with this email address already exists in the system (e.g. Admin or existing user).' });
    }

    const teacher = new Teacher({ name, email, subject });
    await teacher.save();

    // Create user account with default password 'teacher123'
    const user = new User({
      email,
      password: 'teacher123',
      role: 'teacher',
      name,
      teacherRef: teacher._id
    });
    await user.save();

    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email, subject } = req.body;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (subject) teacher.subject = subject;

    await teacher.save();

    // Sync credentials
    await User.findOneAndUpdate(
      { teacherRef: teacher._id },
      { name: teacher.name, email: teacher.email }
    );

    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Remove user account
    await User.findOneAndDelete({ teacherRef: id });

    res.status(200).json({ message: 'Teacher and user account deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOwnTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.teacherRef;
    if (!teacherId) {
      return res.status(400).json({ error: 'No teacher profile linked to this user' });
    }
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOwnTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user.teacherRef;
    if (!teacherId) {
      return res.status(400).json({ error: 'No teacher profile linked to this user' });
    }
    const { name, email, department, subject, phone } = req.body;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher profile not found' });
    }

    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (department) teacher.department = department;
    if (subject) teacher.subject = subject;
    if (phone !== undefined) teacher.phone = phone;

    await teacher.save();

    // Sync credentials
    await User.findByIdAndUpdate(req.user._id, {
      name: teacher.name,
      email: teacher.email
    });

    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeOwnTeacherPassword = async (req, res) => {
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

const deleteOwnTeacherAccount = async (req, res) => {
  try {
    const teacherId = req.user.teacherRef;
    if (!teacherId) {
      return res.status(400).json({ error: 'No teacher profile linked to this user' });
    }

    await Teacher.findByIdAndDelete(teacherId);
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ message: 'Teacher account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getOwnTeacherProfile,
  updateOwnTeacherProfile,
  changeOwnTeacherPassword,
  deleteOwnTeacherAccount
};
