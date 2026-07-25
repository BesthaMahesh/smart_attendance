const Subject = require('../models/Subject');
const Student = require('../models/Student');

const getSubjects = async (req, res) => {
  try {
    const { teacherId, studentId } = req.query;
    
    let query = {};
    if (teacherId) {
      query.teacher = teacherId;
    }
    if (studentId) {
      query.students = studentId;
    }

    const subjects = await Subject.find(query)
      .populate('teacher')
      .populate('students')
      .sort({ name: 1 });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSubject = async (req, res) => {
  const { subjectCode, name, section, teacherId } = req.body;
  if (!subjectCode || !name || !section || !teacherId) {
    return res.status(400).json({ error: 'Subject code, name, section, and teacher ID are required' });
  }

  try {
    const exists = await Subject.findOne({ subjectCode });
    if (exists) {
      return res.status(400).json({ error: 'Subject code already exists' });
    }

    const subject = new Subject({
      subjectCode,
      name,
      section,
      teacher: teacherId,
      students: []
    });

    await subject.save();
    const populated = await subject.populate('teacher');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, section, teacherId, students, action, studentId } = req.body;

  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    if (action === 'enroll') {
      if (!subject.students.includes(studentId)) {
        subject.students.push(studentId);
      }
    } else if (action === 'unenroll') {
      subject.students = subject.students.filter(s => s.toString() !== studentId);
    } else {
      if (name) subject.name = name;
      if (section) subject.section = section;
      if (teacherId) subject.teacher = teacherId;
      if (students) subject.students = students;
    }

    await subject.save();
    const populated = await subject.populate('teacher students');
    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(200).json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
