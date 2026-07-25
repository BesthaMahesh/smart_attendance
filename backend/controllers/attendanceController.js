const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const updateStudentPercentage = async (studentId) => {
  const totalLogs = await Attendance.countDocuments({ studentId });
  if (totalLogs === 0) {
    await Student.findByIdAndUpdate(studentId, { attendancePercentage: 100 });
    return;
  }
  const presentLogs = await Attendance.countDocuments({ studentId, status: 'Present' });
  const percentage = Math.round((presentLogs / totalLogs) * 100);
  await Student.findByIdAndUpdate(studentId, { attendancePercentage: percentage });
};

const recordAttendance = async (req, res) => {
  const { teacherId, subject, date, records } = req.body;
  if (!teacherId || !subject || !records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Teacher ID, subject, and records are required' });
  }

  const dateVal = date ? new Date(date) : new Date();

  try {
    const savedLogs = [];
    for (const record of records) {
      const startOfDay = new Date(dateVal);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateVal);
      endOfDay.setHours(23, 59, 59, 999);

      let log = await Attendance.findOne({
        studentId: record.studentId,
        subject,
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      if (log) {
        log.status = record.status;
        log.teacherId = teacherId;
        await log.save();
      } else {
        log = new Attendance({
          studentId: record.studentId,
          teacherId,
          subject,
          date: dateVal,
          status: record.status
        });
        await log.save();
      }
      savedLogs.push(log);
      
      await updateStudentPercentage(record.studentId);
    }

    res.status(201).json({ message: 'Attendance recorded successfully', logs: savedLogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAttendance = async (req, res) => {
  const { studentId, teacherId, subject, date } = req.query;
  const query = {};
  if (studentId) query.studentId = studentId;
  if (teacherId) query.teacherId = teacherId;
  if (subject) query.subject = subject;
  if (date) {
    const targetDate = new Date(date);
    const start = new Date(targetDate).setHours(0, 0, 0, 0);
    const end = new Date(targetDate).setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  try {
    const logs = await Attendance.find(query)
      .populate('studentId')
      .populate('teacherId')
      .sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  recordAttendance,
  getAttendance,
  updateStudentPercentage
};
